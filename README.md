# Full-Stack CI/CD Deployment using GitHub Actions & AWS

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL (Amazon RDS)
- CI/CD: GitHub Actions
- Cloud: AWS (EC2, S3, IAM, SSM, CloudWatch)

## Architecture Overview
This project demonstrates a production-grade CI/CD pipeline where
frontend and backend are automatically built and deployed on every
push to the main branch.

## CI/CD Flow
1. Code pushed to main branch
2. GitHub Actions builds and tests application
3. Frontend deployed to S3
4. Backend deployed to EC2
5. Monitoring enabled via CloudWatch
