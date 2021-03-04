import React, { useState, useCallback } from "react";
import styled from "styled-components";
import SkillFilterForm from "./SkillFilterForm";
import { Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  Locations,
  SERVER_URL,
  CLIENT_URL,
} from "../../../lib/constant/constant";
import TagBox from "./TagBox";
import { writePostRequestAction } from "../../../reducers/post";
import Router, { withRouter } from "next/router";
import axios from "axios";
import Editor from "./Editor";
import FormData from "form-data";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 글작성 컴포넌트
 */

// style

const WriteFormWrapper = styled.div`
  margin: 40px 0;
  background: #fff;
  padding: 40px;
  .file-btn {
    &:hover {
      color: #111;
      border: 1px solid #313355;
    }
  }
`;

const TitleWrapper = styled.h3`
  margin-bottom: 30px;
`;

const FormItemWrapper = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.span`
  font-weight: 500;
`;

const EditFileList = styled.div`
  margin: 8px 0;
  border: 1px solid #ccc;
  padding: 8px;
`;

// helper variables

const LocationSelectChildren = [];
const PeopleSelectChildren = [];
const ForumSelectChildren = [
  <Select.Option key="자유">자유</Select.Option>,
  <Select.Option key="QnA">QnA</Select.Option>,
];
Locations.forEach((v, i) => {
  LocationSelectChildren.push(
    <Select.Option key={v.key}>{v.value}</Select.Option>,
  );
});
for (let i = 0; i < 10; i++) {
  PeopleSelectChildren.push(<Select.Option key={i + 1}>{i + 1}</Select.Option>);
}

const WriteForm = ({ contentType, router, isEdit }) => {
  // redux

  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.post);
  const { skill } = useSelector((state) => state.skill);
  const { me } = useSelector((state) => state.user);

  // helper method

  const mergeFiles = () => {
    let mergedFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      let newFile = {};
      newFile.url = `${fileList[i]}`;
      newFile.thumbUrl = `${fileList[i]}`;
      newFile.name = fileNames[i];
      newFile.uid = i;
      newFile.status = "done";
      mergedFiles.push(newFile);
    }
    return mergedFiles;
  };

  // local state

  const [title, setTitle] = isEdit ? useState(post.title) : useState("");
  const [description, setDescription] = isEdit
    ? useState(post.content)
    : useState("");
  const [fileList, setFileList] = isEdit
    ? useState(post.fileUrl)
    : useState([]);
  const [fileNames, setFileNames] = isEdit
    ? useState(post.fileName)
    : useState([]);
  const [mergedFiles, setMergedFiles] = useState(mergeFiles());
  const [peopleNumber, setPeopleNumber] = isEdit
    ? useState(post.recruitment)
    : useState(1);
  const [location, setLocation] = isEdit
    ? useState(post.location)
    : useState("전체");
  const [filter, setFilter] = isEdit ? useState(post.field) : useState("자유");
  const [tags, setTags] = isEdit ? useState(post.tag) : useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");

  // event listener

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);
  const onChangeDescription = useCallback((e) => {
    setDescription(e);
  }, []);
  const onChangeFileList = useCallback(
    (e) => {
      setMergedFiles(mergedFiles.concat(e));
    },
    [mergedFiles],
  );
  const onRemoveFile = useCallback(
    (e) => {
      setMergedFiles(
        mergedFiles.filter((v, i) => {
          if (v.uid !== e.uid) {
            return { ...v };
          }
        }),
      );
    },
    [mergedFiles],
  );
  const onChangePeopleNumber = useCallback((value) => {
    setPeopleNumber(value);
  }, []);
  const onChangeLocation = useCallback((value) => {
    setLocation(value);
  }, []);

  const onStudyAndProjectSubmit = useCallback(() => {
    if (!me) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (skill.length === 0) {
      alert("활용기술을 하나 이상 선택해주세요.");
      return;
    }
    if (title === "") {
      alert("제목을 채워주세요.");
      return;
    }
    if (description === "") {
      alert("내용을 채워주세요.");
      return;
    }
    if (description.length < 5) {
      alert("내용을 5글자 이상 써주세요.");
      return;
    }
    let submitConfirm = confirm("게시물을 등록하시겠습니까?");
    if (submitConfirm) {
      const formData = new FormData();
      mergedFiles.forEach((file) => formData.append("files", file));

      formData.append("type", contentType);
      formData.append("writer", me._id);
      formData.append("title", title);
      formData.append("content", description);
      formData.append("techStack", JSON.stringify(skill));
      formData.append("recruitment", peopleNumber);
      formData.append("location", location);

      dispatch(writePostRequestAction(formData));
    } else {
      return;
    }
  }, [
    skill,
    title,
    description,
    peopleNumber,
    location,
    me,
    router,
    mergedFiles,
  ]);

  const onStudyAndProjectEdit = useCallback(() => {
    if (!me) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (skill.length === 0) {
      alert("활용기술을 하나 이상 선택해주세요.");
      return;
    }
    if (title === "") {
      alert("제목을 채워주세요.");
      return;
    }
    if (description === "") {
      alert("내용을 채워주세요.");
      return;
    }
    if (description.length < 5) {
      alert("내용을 5글자 이상 써주세요.");
      return;
    }
    let editConfirm = confirm("수정하시겠습니까?");
    if (editConfirm) {
      const formData = new FormData();
      let existFilePaths = [];
      let existFileNames = [];
      mergedFiles.forEach((file) => {
        if (file.size) {
          formData.append("files", file);
        } else {
          existFilePaths.push(file.url.replace(`${SERVER_URL}/`, ""));
          existFileNames.push(file.name);
        }
      });

      formData.append("type", contentType);
      formData.append("id", post._id);
      formData.append("title", title);
      formData.append("content", description);
      formData.append("recruitment", peopleNumber);
      formData.append("location", location);
      formData.append("techStack", JSON.stringify(skill));
      formData.append("filePath", JSON.stringify(existFilePaths));
      formData.append("fileName", JSON.stringify(existFileNames));
      axios
        .patch(`api/posts`, formData)
        .then(() => {
          Router.push(`/articles/${post.type}/${post._id}`);
        })
        .catch((error) => {
          alert("수정실패");
        });
    } else {
      return;
    }
  }, [skill, title, description, peopleNumber, location, post, mergedFiles]);

  const onChangeFilter = useCallback((value) => {
    setFilter(value);
  }, []);

  const onForumSubmit = useCallback(() => {
    if (!me) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (title === "") {
      alert("제목을 채워주세요.");
      return;
    }
    if (description === "") {
      alert("내용을 채워주세요.");
      return;
    }
    if (description.length < 5) {
      alert("내용을 5글자 이상 써주세요.");
      return;
    }

    let submitConfirm = confirm("게시물을 등록하시겠습니까?");
    if (submitConfirm) {
      const formData = new FormData();
      mergedFiles.forEach((file) => formData.append("files", file));
      formData.append("type", "forum");
      formData.append("writer", me._id);
      formData.append("title", title);
      formData.append("content", description);
      formData.append("tag", JSON.stringify(tags));
      formData.append("field", filter);

      dispatch(writePostRequestAction(formData));
    } else {
      return;
    }
  }, [title, description, tags, router, me, filter, mergedFiles]);

  const onForumEdit = useCallback(() => {
    if (!me) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (title === "") {
      alert("제목을 채워주세요.");
      return;
    }
    if (description === "") {
      alert("내용을 채워주세요.");
      return;
    }
    if (description.length < 5) {
      alert("내용을 5글자 이상 써주세요.");
      return;
    }

    let editConfirm = confirm("수정하시겠습니까?");
    if (editConfirm) {
      const formData = new FormData();
      let existFilePaths = [];
      let existFileNames = [];

      mergedFiles.forEach((file) => {
        if (file.size) {
          formData.append("files", file);
        } else {
          existFilePaths.push(file.url.replace(`${SERVER_URL}/`, ""));
          existFileNames.push(file.name);
        }
      });

      formData.append("type", "forum");
      formData.append("id", post._id);
      formData.append("title", title);
      formData.append("content", description);
      formData.append("tag", JSON.stringify(tags));
      formData.append("field", filter);
      formData.append("filePath", JSON.stringify(existFilePaths));
      formData.append("fileName", JSON.stringify(existFileNames));

      axios
        .patch(`api/posts`, formData)
        .then(() => {
          Router.push(`/${post.type}/${post._id}`);
        })
        .catch((error) => {
          alert("수정실패");
        });
    } else {
      return;
    }
  }, [title, description, tags, post, filter, mergedFiles]);

  return (
    <>
      {contentType == "study" || contentType == "project" ? (
        <WriteFormWrapper>
          {contentType === "study" ? (
            <TitleWrapper>스터디 모집</TitleWrapper>
          ) : (
            <TitleWrapper>프로젝트 모집</TitleWrapper>
          )}
          <FormItemWrapper>
            <div style={{ marginBottom: "7px" }}>
              <Label>활용기술</Label>
            </div>
            <SkillFilterForm
              type="write"
              isEdit={isEdit}
              values={isEdit && post.techStack}
            />
          </FormItemWrapper>
          <FormItemWrapper style={{ display: "flex" }}>
            <Label style={{ lineHeight: "32px" }}>모집인원</Label>
            <Select
              defaultValue={isEdit ? post.recruitment : "1"}
              bordered={false}
              style={{ color: "#999" }}
              onChange={onChangePeopleNumber}
            >
              {PeopleSelectChildren}
            </Select>
            <Label style={{ lineHeight: "32px" }}>지역</Label>
            <Select
              defaultValue={isEdit ? post.location : "전체"}
              bordered={false}
              style={{ color: "#999" }}
              onChange={onChangeLocation}
            >
              {LocationSelectChildren}
            </Select>
          </FormItemWrapper>

          <Editor
            onChangeDescription={onChangeDescription}
            onChangeTitle={onChangeTitle}
            description={description}
            title={title}
          />

          <Upload
            name="logo"
            beforeUpload={onChangeFileList}
            defaultFileList={mergeFiles()}
            onRemove={onRemoveFile}
          >
            <Button className="file-btn" icon={<UploadOutlined />}>
              파일 업로드
            </Button>
          </Upload>
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <Button
              type="primary"
              style={{
                width: "100px",
                background: "#313355",
                color: "#fff",
                border: "1px solid #313355",
              }}
              onClick={isEdit ? onStudyAndProjectEdit : onStudyAndProjectSubmit}
            >
              {isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </WriteFormWrapper>
      ) : (
        <WriteFormWrapper>
          <TitleWrapper>글쓰기</TitleWrapper>
          <FormItemWrapper>
            <Label style={{ lineHeight: "32px" }}>분류</Label>
            <Select
              defaultValue={isEdit ? post.field : filter}
              bordered={false}
              style={{ color: "#999" }}
              onChange={onChangeFilter}
            >
              {ForumSelectChildren}
            </Select>
          </FormItemWrapper>

          <FormItemWrapper>
            <div style={{ marginBottom: "7px" }}>
              <Label>태그</Label>
            </div>
            <TagBox
              tags={tags}
              setTags={setTags}
              inputVisible={inputVisible}
              setInputVisible={setInputVisible}
              inputValue={inputValue}
              setInputValue={setInputValue}
              editInputIndex={editInputIndex}
              setEditInputIndex={setEditInputIndex}
              editInputValue={editInputValue}
              setEditInputValue={setEditInputValue}
            />
          </FormItemWrapper>

          <Editor
            onChangeDescription={onChangeDescription}
            onChangeTitle={onChangeTitle}
            description={description}
            title={title}
          />
          <Upload
            name="logo"
            beforeUpload={onChangeFileList}
            defaultFileList={mergeFiles()}
            onRemove={onRemoveFile}
          >
            <Button className="file-btn" icon={<UploadOutlined />}>
              파일 업로드
            </Button>
          </Upload>

          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <Button
              type="primary"
              style={{
                width: "100px",
                background: "#313355",
                color: "#fff",
                border: "1px solid #313355",
              }}
              onClick={isEdit ? onForumEdit : onForumSubmit}
            >
              {isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </WriteFormWrapper>
      )}
    </>
  );
};

export default withRouter(WriteForm);
