# Functional Requirements

-   CRUD Recipies
-   CRUD Ingridients
-   CRUD Cuisine

# Non-Functional Requirements

-   No auth / Single user
-   <100 different recipies

# Entities

```ts
type Ingridient = {
    id: string;
    label: string;
};

type Cuisine = {
    id: string;
    label: string;
};

type Fullness = 'low' | 'medium' | 'high';

type Recipy = {
    title: string;
    createdAt: string;
    updatedAt: string;
    details: {
        calories?: number;
        isNew?: boolean;
        fullness: Fullness;
        cuisine: Cuisine['id'][];
        ingridients: Ingridient['id'][];
    };
    // mdx
    content: string;
    heroPictureURL: string;
};
```

# Backend APIs

-   CRUD Recipies
-   CRUD Ingridients
-   CRUD Cuisine

# Frontend

-   Home Page

    -   Filters/Search
    -   Recipy cards

-   Recipy Page

-   Recipy Edit Page
