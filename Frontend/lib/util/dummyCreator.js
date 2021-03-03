import shortId from "shortid";
import faker from "faker";

/**
 * @author 박진호
 * @version 1.0
 * @summary 더미데이터 생성 유틸 함수
 */

export const dummyMeCreator = () => {
  return {
    id: 111,
    nickname: "zinozino",
    email: "gogod23@naver.com",
    password: "safmimf3i2@#k9aci",
    techStack: ["React", "JavaScript", "Vue"],
    githubUrl: "http://github.com/zinozino1",
    filePath: "",
    comments: [],
    likes: [],
    scraps: [],
    email_verified: false,
    key_for_verify: "123",
    registerDate: new Date(),
    rating: 4,
    posts: [
      {
        id: 1,
        title: "포스트1",
        content: "content1",
        filePath: "/usr/bin",
        writer: 1,
        createAt: new Date(),
        views: 100,
        techStack: [],
        area: "",
        recruitment: 10,
        type: "study",
        isOnGoing: true,
        likes: 40,
        scraped: 10,
        comments: [
          {
            id: 1,
            writer: 2,
            content: "안녕하세요",
            postId: 1,
            createAt: new Date(),
            commentTo: null, // 대댓글이 아님
            secret: false,
            likes: 30,
          },
        ],
      },
    ],
  };
};

export const dummyPostCreator = (type) => {
  if (type == "study" || type == "project")
    return {
      id: shortId.generate(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      filePath: faker.image.image(),
      writer: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
        email: faker.random.word(),
        password: faker.random.word(),
        techStack: Array(3)
          .fill()
          .map((v, i) => faker.lorem.word()),
        githubUrl: faker.random.word(),
        filePath: faker.image.image(),
        posts: Array(3)
          .fill()
          .map((v, i) => {
            dummy: i;
          }),
        rating: 4,
        createdAt: faker.date.recent(),
      },
      createdAt: faker.date.recent(),
      techStack: Array(3)
        .fill()
        .map((v, i) => faker.lorem.word()),
      views: parseInt(faker.random.number() / 100),
      area: "서울",
      recruitment: 4,
      type: type === "study" ? "study" : "project",
      isOnGoing: faker.random.boolean(),
      likes: parseInt(faker.random.number() / 100),
      scraped: parseInt(faker.random.number() / 100),
      comments: [
        {
          id: 1,
          writer: dummyMeCreator(),
          content: "1번 댓글",
          postId: 1,
          createAt: new Date(),
          commentTo: null,
          secretComment: false,
          likes: 10,
        },
        {
          id: 2,
          writer: dummyMeCreator(),
          content: "2번 댓글",
          postId: 1,
          createAt: new Date(),
          commentTo: null,
          secretComment: true,
          likes: 20,
        },
        {
          id: 3,
          writer: dummyMeCreator(),
          content: "3번 댓글",
          postId: 1,
          createAt: new Date(),
          commentTo: 1,
          secretComment: false,
          likes: 340,
        },
        {
          id: 4,
          writer: dummyMeCreator(),
          content: "4번 댓글",
          postId: 1,
          createAt: new Date(),
          commentTo: null, // 대댓글이 아님
          secretComment: true,
          likes: 12,
        },
        {
          id: 5,
          writer: dummyMeCreator(),
          content: "5번 댓글",
          postId: 1,
          createAt: new Date(),
          commentTo: 1, // 대댓글이 아님
          secretComment: true,
          likes: 12,
        },
      ],
    };
  else
    return {
      id: shortId.generate(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      filePath: faker.image.image(),
      writer: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
        email: faker.random.word(),
        password: faker.random.word(),
        techStack: Array(3)
          .fill()
          .map((v, i) => faker.lorem.word()),
        githubUrl: faker.random.word(),
        filePath: faker.image.image(),
        posts: Array(3)
          .fill()
          .map((v, i) => {
            dummy: i;
          }),
        rating: 4,
        createdAt: faker.date.recent(),
      },
      createdAt: faker.date.recent(),
      techStack: Array(3)
        .fill()
        .map((v, i) => faker.lorem.word()),
      views: parseInt(faker.random.number() / 100),
      area: "서울",
      type: "forum",
      likes: parseInt(faker.random.number() / 100),
      scraped: parseInt(faker.random.number() / 100),
      comments: [
        {
          id: 1,
          writer: dummyMeCreator(),
          content: "반가워요",
          postId: 1,
          createAt: new Date(),
          commentTo: null,
          secretComment: false,
          likes: 10,
        },
        {
          id: 2,
          writer: dummyMeCreator(),
          content: "ㅋㅇㅌㄹㅋㅇㄹ",
          postId: 1,
          createAt: new Date(),
          commentTo: 1,
          secretComment: true,
          likes: 20,
        },
        {
          id: 3,
          writer: dummyMeCreator(),
          content: "ㅋㅋ",
          postId: 1,
          createAt: new Date(),
          commentTo: 1,
          secretComment: false,
          likes: 340,
        },
        {
          id: 4,
          writer: dummyMeCreator(),
          content: "ㄴㄴ",
          postId: 1,
          createAt: new Date(),
          commentTo: null, // 대댓글이 아님
          secretComment: true,
          likes: 12,
        },
      ],
      filter: "QnA",
      tags: Array(3)
        .fill()
        .map((v, i) => faker.random.word()),
    };
};

export const dummyPostsCreator = (type, number) => {
  if (type == "study" || type == "project")
    return Array(number)
      .fill()
      .map((v, i) => ({
        id: shortId.generate(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        filePath: faker.image.image(),
        writer: {
          id: shortId.generate(),
          nickname: faker.name.findName(),
          email: faker.random.word(),
          password: faker.random.word(),
          techStack: Array(3)
            .fill()
            .map((v, i) => faker.lorem.word()),
          githubUrl: faker.random.word(),
          filePath: faker.image.image(),
          posts: Array(3)
            .fill()
            .map((v, i) => {
              dummy: i;
            }),
          rating: 4,
          registerDate: faker.date.recent(),
        },
        createAt: faker.date.recent(),
        techStack: Array(3)
          .fill()
          .map((v, i) => faker.lorem.word()),
        views: parseInt(faker.random.number() / 100),
        area: "서울",
        recruitment: 4,
        type: type === "study" ? "study" : "project",
        isOnGoing: faker.random.boolean(),
        likes: parseInt(faker.random.number() / 100),
        scraped: parseInt(faker.random.number() / 100),
        comments: Array(3)
          .fill()
          .map((v, i) => ({
            id: shortId.generate(),
            writer: dummyMeCreator(),
            content: "안녕하세요",
            postId: 1,
            createAt: new Date(),
            commentTo: shortId.generate(), // 대댓글이 아님
            secret: false,
            likes: 30,
          })),
      }));
  else
    return Array(number)
      .fill()
      .map((v, i) => ({
        id: shortId.generate(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        filePath: faker.image.image(),
        writer: {
          id: shortId.generate(),
          nickname: faker.name.findName(),
          email: faker.random.word(),
          password: faker.random.word(),
          techStack: Array(3)
            .fill()
            .map((v, i) => faker.lorem.word()),
          githubUrl: faker.random.word(),
          filePath: faker.image.image(),
          posts: Array(3)
            .fill()
            .map((v, i) => {
              dummy: i;
            }),
          rating: 4,
          registerDate: faker.date.recent(),
        },
        createAt: faker.date.recent(),
        techStack: Array(3)
          .fill()
          .map((v, i) => faker.lorem.word()),
        views: parseInt(faker.random.number() / 100),
        area: "서울",
        type: "forum",
        likes: parseInt(faker.random.number() / 100),
        scraped: parseInt(faker.random.number() / 100),
        comments: Array(3)
          .fill()
          .map((v, i) => ({
            id: shortId.generate(),
            writer: dummyMeCreator(),
            content: "안녕하세요",
            postId: 1,
            createAt: new Date(),
            commentTo: shortId.generate(), // 대댓글이 아님
            secret: false,
            likes: 30,
          })),
        filter: "QnA",
        tags: Array(3)
          .fill()
          .map((v, i) => faker.random.word()),
      }));
};
