# E-Commerce System

## Table of Contents
- [E-Commerce System](#e-commerce-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
- [c4 model](#c4-model)

## Overview
E-Commerce System is an e-commerce platform built with microservices.

# c4 model 
site Link https://structurizr.com/dsl

workspace "E-Commerce System" "An e-commerce platform using microservices" {

    !identifiers hierarchical

    model {
        u = person "User"

        ss = softwareSystem "E-Commerce System" {
            wa = container "Web Application" "Frontend UI for users"
            gateway = container "API Gateway" "Handles requests and routes to microservices"

            userService = container "User Service" "Manages authentication and user profiles"
            productService = container "Product Service" "Handles product catalog and inventory"
            orderService = container "Order Service" "Processes orders and payments"

            kafka = container "Kafka" "Message broker for asynchronous communication" {
                tags "Message Broker"
            }

            dbUser = container "User Database" {
                tags "Database"
            }
            dbProduct = container "Product Database" {
                tags "Database"
            }
            dbOrder = container "Order Database" {
                tags "Database"
            }

            u -> wa "Uses"
            wa -> gateway "Sends API requests"

            gateway -> userService "For authentication and profile management"
            gateway -> productService "For product details"
            gateway -> orderService "For order processing"

            userService -> dbUser "Reads from and writes to"
            productService -> dbProduct "Reads from and writes to"
            orderService -> dbOrder "Reads from and writes to"

            orderService -> kafka "Publishes Order Events"
            kafka -> productService "Sends Order Events"
        }
    }

    views {
        systemContext ss "SystemContext" {
            include *
            autolayout lr
        }

        container ss "ContainerView" {
            include *
            autolayout lr
        }

        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #ba1e75
                shape person
            }
            element "Software System" {
                background #d92389
            }
            element "Container" {
                background #f8289c
            }
            element "Database" {
                shape cylinder
            }
            element "Message Broker" {
                background #ff9900
                shape hexagon
            }
        }
    }

    configuration {
        scope softwaresystem
    }
}
