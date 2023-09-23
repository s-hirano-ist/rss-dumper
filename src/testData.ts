export const testData = {
  noNewsDetail: { heading: "test-a", description: "description A" },
  withNewsDetail: {
    heading: "test-b",
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
  other1: { heading: "test-c", description: "description C" },
};
