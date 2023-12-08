import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./DetailedProject.module.css";
import Dialog from "./Dialog.jsx";
import CreateDialog from "./CreateDialog.jsx";
import { fetchIssues } from "./api/index.js";
import { createIssue } from "./api/createIssue.js";
import { deleteIssue } from "./api/deleteIssue.js";
import { changeStatus } from "./api/dragDrop.js";
import { getIssue } from "./api/getIssue.js";
import { changeIssue } from "./api/changeIssue.js";
import { useLocation } from "react-router-dom";
import { createComment } from "./api/createComment.js";
// import { selectUser } from "../Authentication/AuthSlice/userSlice.js";
// import { useSelector } from "react-redux";
import { getMembers } from "./api/getMembers.js";
import { getCategories } from "./api/getCategories.js";
import { removeComment } from "./api/removeComment.js";
import { getPrjName } from "./api/getPrjName.js";
import { searchNewMember } from "./api/searchNewMember.js";
// import { addPrjMem } from "./api/addPrjMem.js";
import { editComment } from "./api/editComment.js";
import Snackbar from "./SnackBar.jsx";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 6;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "DarkSlateGray",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, itemCount) => ({
  background: isDraggingOver ? "lightblue" : "black",
  padding: grid,
  width: 200,
  // height: itemCount * 140, // Điều chỉnh chiều cao dựa trên số lượng Draggable
});

function App() {
  const location = useLocation();
  const prjId = location.pathname.substring(18);

  const [prjName, setPrjName] = useState();

  getPrjName(prjId).then((res) => {
    // console.log("New res: ", res)
    setPrjName(res.project_name);
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowSnackbar = () => {
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  const [statusInfo, setStatusInfo] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState(null);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const [members, setMembers] = useState([]);

  const loadMembers = () => {
    getMembers(prjId).then((res) => {
      // console.log("New res: ", res);
      setMembers(res);
    });
  };

  const [newMembers, setNewMembers] = useState([]);

  const loadNewMembers = () => {
    searchNewMember(prjId).then((res) => {
      // console.log("New res: ", res);
      setNewMembers(res);
    });
  };

  const [selectedNewMember, setSelectedNewMember] = useState([]);

  const [categories, setCategories] = useState([]);

  const loadCategories = () => {
    getCategories(prjId).then((res) => {
      //   console.log("New res: ", res);
      setCategories(res);
    });
  };

  const [detailedIssue, setDetailedIssue] = useState({});

  const loadIssue = async (id) => {
    await getIssue(id).then((res) => {
      // console.log("loadIssue: ", res);
      setDetailedIssue(res);
      // console.log("detailedIssue:",detailedIssue);
    });
  };

  useEffect(() => {
    // console.log("detailedIssue:", detailedIssue);
  }, [detailedIssue]);

  const loadData = () => {
    fetchIssues(prjId).then((res) => {
      // console.log("New res: ", res)
      setState(res);
    });
  };

  useEffect(() => {
    loadData();
    loadMembers();
    loadCategories();
    loadNewMembers();
  }, []);

  const [issueMembers, setIssueMembers] = useState([]);

  useEffect(() => {
    // console.log(issueMembers); // Log giá trị mới sau khi cập nhậ
    // const member_id_list = issueMembers.map((member) => member.id);
  }, [issueMembers]);

  const addMember = (newMember) => {
    // console.log("member_id_list:",member_id_list);
    // //
    // changeIssue
  };

  const addIssue = async (prjId, issueName, catId, summary, status_id) => {
    // console.log("trc goi api:", prjId, issueName, catId, summary, status_id);
    await createIssue(prjId, issueName, catId, summary, status_id);
    loadData();
  };

  const removeIssue = async (issueId) => {
    await deleteIssue(issueId);
    loadData();
  };

  const [snackBarMessage, setSnackBarMessage] = useState();

  const updateIssue = async (
    issueId,
    description,
    assigned_to_id,
    category_id,
    newComment,
    member_id_list
  ) => {
    try {
      await changeIssue(
        issueId,
        description,
        assigned_to_id,
        category_id,
        newComment,
        member_id_list
      );
      setSnackBarMessage("Successfully saved");
      loadIssue(selectedIssue.id);
    } catch (error) {
      setSnackBarMessage("Failed to save changes");
    }
  };

  const addComment = async (issueId, newComment) => {
    await createComment(issueId, newComment);
    loadIssue(selectedIssue.id);
  };

  const updateComment = async (id, commentId) => {
    await editComment(id, commentId);
    loadIssue(selectedIssue.id);
  };

  const updateCategory = async (id, category_id) => {
    await changeIssue(id, category_id);
    loadIssue(selectedIssue.id);
  };

  const deleteComment = async (commentId) => {
    await removeComment(commentId);
    loadData();
  };

  const handleCreateButtonClick = (droppableId) => {
    // console.log(prjId);
    setStatusInfo(droppableId);
    setIsCreateDialogOpen(true);
  };

  const handleIssueClick = async (issue) => {
    setSelectedIssue(issue);
    // console.log(issue);

    await loadIssue(issue.id);
    setIsDialogOpen(true);
  };

  // const handleAddPrjMem = async (member) => {
  //   // setSelectedIssue(issue);
  //   // console.log(issue);
  //   await addPrjMem(member);

  //   // await loadIssue(issue.id);
  //   // setIsDialogOpen(true);
  // };

  const [state, setState] = useState(
    []
    // data
  );

  useEffect(() => {
    // console.log(issueMembers); // Log giá trị mới sau khi cập nhậ
  }, [state]);

  // useEffect(() => { if (data) { setState(data) } }, [data]);
  // const projectMembers = projectMembersData.projectMembers; // Sử dụng dữ liệu từ projectMembersData

  const convertValue = (value) => {
    switch (value) {
      case "Open":
        return 1;
      case "In Progress":
        return 2;
      case "Reopen":
        return 3;
      case "Resolved ":
        return 4;
      case "Closed":
        return 5;
      case "Archive":
        return 6;
      default:
        return value;
    }
  };

  //   let user = useSelector(selectUser);

  // const [assignedMember, setAssignedMember] = useState("");

  function onDragEnd(result) {
    const { source, destination } = result;
    // getIssue(result.draggableId).then(res => {
    //     // console.log("New res: ", res)
    //     // setAssignedMember(res.assigned_to.id.toString());

    // });

    // console.log("status_id:", convertValue(destination.droppableId));
    changeStatus(result.draggableId, convertValue(destination.droppableId));

    if (!destination) {
      return;
    }

    const sourceDroppable = source.droppableId;
    const destinationDroppable = destination.droppableId;

    if (sourceDroppable === destinationDroppable) {
      // if (state[sourceDroppable] && state[sourceDroppable].items)
      {
        const items = reorder(
          state[sourceDroppable],
          source.index,
          destination.index
        );
        const newState = { ...state };
        newState[sourceDroppable] = items;
        setState(newState);
      }
    } else {
      // if (state[sourceDroppable]
      //     && state[sourceDroppable].items
      //     && state[destinationDroppable]
      //     && state[destinationDroppable].items
      // )
      {
        const result = move(
          state[sourceDroppable],
          state[destinationDroppable],
          source,
          destination
        );

        // console.log(state[sourceDroppable].items);

        const newState = { ...state };
        newState[sourceDroppable] = result[sourceDroppable];
        newState[destinationDroppable] = result[destinationDroppable];
        setState(newState);
      }
    }

    // setStatusInfo({
    //     itemId: result.draggableId,
    //     destinationDroppable,
    // });
    // loadData();
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        {/* <h1>{prjName}</h1>
        {members.map((member, index) => (
          <span key={member.id}>
            {member.member.user_name}
            {index < members.length - 1 ? ", " : ""}
          </span>
        ))} */}

        {/* <select
          onChange={(e) => {
            const memberId = e.target.value;

            const selected = newMembers.find(
              (member) => member.member.id == memberId
            );
            setSelectedNewMember(selected.member);
          }}
        >
          {newMembers.map((member) => (
            <option key={member.member.id} value={member.member.id}>
              {member.member.user_name}
            </option>
          ))}
        </select> */}
        {/* <button onClick={handleAddPrjMem(selectedNewMember)}>Add</button> */}
      </div>

      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* {[1, 2, 3, 4, 5].map((ind) => ( */}
          {Object.entries(state).map(([status, items], ind) => (
            <Droppable key={ind} droppableId={status}>
              {(provided, snapshot) => (
                <div className={styles.droppable}>
                  <div
                    ref={provided.innerRef}
                    className={styles.listContainer}
                    // style={getListStyle(snapshot.isDraggingOver, state[`droppable${ind}`].items.length)}
                    style={getListStyle(snapshot.isDraggingOver, items.length)}
                    {...provided.droppableProps}
                  >
                    {/* <h3>{state[`droppable${ind}`].title}</h3>  */}
                    {/* Hiển thị title */}
                    <h3>{status}</h3>

                    {/* {state[`droppable${ind}`].items.map((item, index) => ( */}
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id.toString()}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {/* <Draggable key={item.id} draggableId={item.id} index={index}> */}
                        {(provided, snapshot) => (
                          <div
                            className={styles.issue}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div
                              key={item.id}
                              onClick={() => handleIssueClick(item)}
                            >
                              {item.issue_name}
                              <div>
                                <p>
                                  Assigned Member: {item.assigned_to.user_name}
                                </p>
                                {/* <ul>
                                                                    {item.teamMembers && item.teamMembers.map((member) => (
                                                                        <li key={member.id}>{member.name}</li>
                                                                    ))}
                                                                </ul> */}
                              </div>

                              {item.category && item.category.category_name}
                              <br></br>
                              {/* {item.summary} */}
                              {/* {item.description} */}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {/* <button onClick={() => handleCreateIssue(`droppable${ind}`)}>+ Add Issue</button> */}
                    <button
                      onClick={() =>
                        handleCreateButtonClick(convertValue(status))
                      }
                    >
                      + Add Issue
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Dialog
        show={isDialogOpen}
        onClose={closeDialog}
        projectMembers={members}
        categories={categories}
        issueMembers={issueMembers}
        onAddMember={addMember}
        issue={detailedIssue}
        onDeleteIssue={removeIssue}
        onUpdateIssue={updateIssue}
        onAddComment={addComment}
        // currentUser={user}
        prjId={prjId}
        loadIssue={loadIssue}
        // droppableId={droppableId}
        // onLogin={handleLogin}
        onDeleteComment={deleteComment}
        onEditComment={updateComment}
        onShowSnackbar={handleShowSnackbar}
        onUpdateCategory={updateCategory}
      />

      <CreateDialog
        show={isCreateDialogOpen}
        onClose={closeCreateDialog}
        projectMembers={members}
        categories={categories}
        issueMembers={issueMembers}
        // onAddMember={assignMember}
        onAddIssue={addIssue}
        thisStatusInfo={statusInfo}
        projectId={prjId}

        // issue={selectedIssue}
      />

      <div>
        {showSnackbar && <Snackbar message={snackBarMessage} duration={3000} />}
        {/* {draggedItemInfo && (
                    <p>
                        Item ID: {draggedItemInfo.itemId}, Destination Droppable: {draggedItemInfo.destinationDroppable}
                    </p>
                )} */}

        {/* Các phần khác trong JSX */}
      </div>
    </div>
  );
}

export default App;
