# MealPlanner

## Overview

MealPlanner is a Node.js web application designed to help you plan meals efficiently. The project utilizes a MySQL database, Sequelize as the ORM, and has different setups for development and production environments using Docker.

## Prerequisites

Ensure that you have the following installed on your machine:

 - Docker
 - Docker Compose

## Docker commands

 - docker compose --profile dev up --build -d       (deploys live updating dev build)
 - docker compose --profile prod up --build -d      (deploys production build)
 - docker exec -u 0 -it *container-name* bash       (access containers shell using bash)
