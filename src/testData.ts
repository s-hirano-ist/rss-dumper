export const testData = {
  noNewsDetail: { title: "test-a", description: "description A" },
  withNewsDetail: {
    title: "test-b",
    description: "description B",
    newsDetail: {
      create: [
        {
          title: "sample B detail A",
          url: "https://aaa.com",
          quote: "sample QUOTE",
        },
        { title: "sample B detail B", url: "https://bbb.com" },
        { title: "sample B detail B", url: "https://ccc.com" },
      ],
    },
  },
  other1: { title: "test-c", description: "description C" },
};
