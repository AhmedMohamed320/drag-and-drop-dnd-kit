const initialTypeList = {
    page: {
      id: 1,
      list: [
        {
          id: "page-1",
          title: "Home",
          url: "/home",
          type: "page",
        },
        {
          id: "page-2",
          title: "About Us",
          url: "/about",
          type: "page",
        },
      ],
    },
    categories: {
      id: 2,
      list: [
        {
          id: "cat-1",
          title: "Technology",
          url: "/categories/technology",
          type: "categories",
        },
        {
          id: "cat-2",
          title: "Health",
          url: "/categories/health",
          type: "categories",
        },
      ],
    },
    catalogs: {
      id: 3,
      list: [
        {
          id: "catlg-1",
          title: "Electronics",
          url: "/catalogs/electronics",
          type: "catalogs",
        },
        {
          id: "catlg-2",
          title: "Books",
          url: "/catalogs/books",
          type: "catalogs",
        },
      ],
    },
    post: {
      id: 4,
      list: [
        {
          id: "post-1",
          title: "Latest Update",
          url: "/post/latest-update",
          type: "post",
        },
        {
          id: "post-2",
          title: "Breaking News",
          url: "/post/breaking-news",
          type: "post",
        },
      ],
    },
    link: {
      id: 5,
      list: [
        {
          id: "link-1",
          title: "Link 1",
          url: "/link/latest-update",
          type: "link",
        },
      ],
    },
    parent: {
      id: 6,
      list: [
        {
          id: "parent-1",
          title: "parent 1",
          type: "parent",
        },
        {
          id: "parent-2",
          title: "parent 2",
          type: "parent",
        },
      ],
    },
  };
  const initialMainMenu = [
    {
      id: "menu-1",
      title: "Main Category",
      type: "parent",
      url: "/main-category",
      children: [
        {
          id: "menu-2",
          title: "Child Item 1",
          type: "post",
          url: "/main-category/child-1",
        },
        {
          id: "menu-3",
          title: "Child Item 2",
          type: "catalogs",
          url: "/main-category/child-2",
        },
      ],
    },
    {
      id: "menu-4",
      title: "External Link",
      type: "link",
      url: "https://example.com",
    },
    {
      id: "menu-5",
      title: "about us",
      type: "page",
      url: "/aboutus",
    },
  ];
  
  export { initialTypeList, initialMainMenu };