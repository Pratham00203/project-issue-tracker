import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./subcomponents/Navbar";
import Spinner from "./subcomponents/Spinner";
import binImg from "../assets/images/bin.png";
import linkImg from "../assets/images/link.png";
import profileImg from "../assets/images/profile-pic.jpg";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import UserContext from "../context/UserContext";
import { toast } from "react-hot-toast";

export default function Issue() {
  const { projectid, issueid } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [copy, setCopy] = useState(false);
  const { user } = useContext(UserContext);
  const commentBody = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loadIssue();
    window.addEventListener("keyup", handleCommentKey);

    function handleCommentKey(e) {
      e.key === "m" &&
        document
          .querySelector(".comments-section .comment-form textarea ")
          .focus();
    }

    return () => {
      window.removeEventListener("keyup", handleCommentKey);
    };
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://trackify-react.netlify.app/project/${projectid}/issue/${issueid}`
    );
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const deleteIssueConfirm = () => {
    const res = window.confirm(
      "Are you sure you want to delete this issue? Once you delete, it's gone for good"
    );
    res && deleteIssue();
  };

  const loadIssue = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/issue/${projectid}/${issueid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setIssue(res.data.issue);
      setComments(res.data.issue.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      if (commentBody.current.value.trim() === "") {
        toast.error("Comment cannot be empty!");
      } else {
        const res = await axios({
          method: "post",
          url: `https://trackify-backend.onrender.com/api/issue/${projectid}/${issueid}/add/comment`,
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
          data: {
            commentBody: commentBody.current.value,
            userId: user.id,
            name: user.name,
          },
        });

        setComments((prev) => {
          return [...prev, res.data.newComment];
        });
        console.log(comments);
        commentBody.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteIssue = async () => {
    try {
      const res = await axios({
        method: "delete",
        url: `https://trackify-backend.onrender.com/api/issue/delete/issue/${issueid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      toast.success(res.data.msg);
      navigate(`/project/${projectid}/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (commentid) => {
    try {
      const res = await axios({
        method: "delete",
        url: `https://trackify-backend.onrender.com/api/issue/${issueid}/delete/comment/${commentid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setComments((prev) => {
        return prev.filter((c) => c._id !== commentid);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      {issue ? (
        <div className='issue-section'>
          <header
            className='d-flex align-center'
            style={{ justifyContent: "space-between" }}>
            <p>Issue - {issueid}</p>
            <div className='header-btns d-flex' style={{ gap: "15px" }}>
              {user.role !== "Client" && (
                <Link to={`/project/${projectid}/update/issue/${issueid}`}>
                  Update
                </Link>
              )}
              <button
                className='d-flex align-center'
                style={{ gap: "7px" }}
                onClick={copyLink}>
                <img src={linkImg} alt='' />
                {copy ? "Link Copied" : "Copy Link"}
              </button>
              {user.role !== "Client" && (
                <button onClick={deleteIssueConfirm}>
                  <img src={binImg} alt='' />
                </button>
              )}
            </div>
          </header>
          <div className='issue-main d-flex'>
            <main style={{ width: "60%" }}>
              <h1>{issue.shortSummary}</h1>
              <div className='i-description'>
                <p>DESCRIPTION</p>
                <div
                  dangerouslySetInnerHTML={{ __html: issue.description }}></div>
              </div>
              <div className='priority'>
                <p>PRIORITY</p>
                <p className={`${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </p>
              </div>
              <div className='status'>
                <p>STATUS</p>
                <p>{issue.status}</p>
              </div>
              <div className='reporter'>
                <p>REPORTER</p>
                <p>{issue.reporterName}</p>
              </div>
              <div className='estimate'>
                <p>ESTIMATE (HOURS)</p>
                <p>{issue.estimateInHours}</p>
              </div>
              <div className='issue-assignees '>
                <p>ASSIGNEES</p>
                <div className='d-flex' style={{ gap: "10px" }}>
                  {issue.assignees.length === 0 ? (
                    <span>Unassigned</span>
                  ) : (
                    issue.assignees.map((a) => {
                      return (
                        <div className='i-assignee' key={a._id}>
                          {a.name}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <p className='i-dates'>
                Created at {moment(issue.createdOn).fromNow()}.
              </p>
              {issue.updatedOn && (
                <p className='i-dates'>
                  Updated at {moment(issue.updatedOn).fromNow()}.
                </p>
              )}
              {issue.closedOn && (
                <p className='i-dates'>
                  Closed at {moment(issue.updatedOn).fromNow()}.
                </p>
              )}
            </main>
            <aside style={{ width: "40%" }}>
              <div className='comments-section'>
                <h1>Comments ({comments.length})</h1>
                <div className='comment-form d-flex' style={{ gap: "15px" }}>
                  <img src={profileImg} alt='' />
                  <div style={{ width: "100%" }}>
                    <textarea
                      name='commentBody'
                      ref={commentBody}
                      placeholder='Add a comment...'></textarea>
                    <p className='tip'>
                      <b>Pro tip: </b>
                      press <span>M</span> to comment
                    </p>
                    <button onClick={addComment}>Save</button>
                  </div>
                </div>
                <div
                  className='comments d-flex flex-col'
                  style={{ gap: "30px" }}>
                  {comments.map((c) => {
                    return (
                      <div
                        className='comment d-flex'
                        style={{ gap: "15px" }}
                        key={c._id}>
                        <img src={profileImg} alt='' />
                        <div className='comment-main'>
                          <p>{c.name}</p>
                          <p className='comment-time'>
                            {moment(c.postedOn).fromNow()}
                          </p>
                          <p className='comment-body'>{c.commentBody}</p>
                          {c.userId === user.id && (
                            <button onClick={() => deleteComment(c._id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
