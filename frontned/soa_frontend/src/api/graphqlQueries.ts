import { gql } from "@apollo/client";

// Queries
export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      username
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      stock
      price
    }
  }
`;

export const GET_PRODUCT_LIST = gql`
  query GetProductList($page: Int, $limit: Int, $search: String) {
    getProductList(page: $page, limit: $limit, search: $search) {
      page
      limit
      total
      totalPage
      search
      products {
        id
        name
        description
        stock
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      userId
      products {
        productId
        quantity
      }
      price
    }
  }
`;

export const GET_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId {
    getOrdersByUserId {
      id
      userId
      products {
        productId
        quantity
      }
      price
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $limit: Int) {
    getAllOrders(page: $page, limit: $limit) {
      page
      limit
      total
      totalPage
      orders {
        id
        userId
        products {
          productId
          quantity
        }
        price
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query getProduct($id: ID!) {
    getProductById(id: $id) {
      id
      name
      description
      price
      stock
    }
  }
`;

// Mutations
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $stock: Int!
    $price: Float!
  ) {
    createProduct(
      name: $name
      description: $description
      stock: $stock
      price: $price
    ) {
      id
      name
      description
      stock
      price
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $stock: Int
    $price: Float
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      stock: $stock
      price: $price
    ) {
      id
      name
      description
      stock
      price
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
      description
      stock
      price
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($products: [ProductDetail]) {
    createOrder(products: $products) {
      id
      userId
      products {
        productId
        quantity
      }
      price
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const SEND_LOGS = gql`
  mutation SendLogs($level: String!, $message: String!, $source: String!) {
    sendLogs(level: $level, message: $message, source: $source) {
      success
      error
    }
  }
`;
