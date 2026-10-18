
pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '616150220810.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPOSITORY = 'docker-ecr'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub.'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t frontend:${BUILD_NUMBER} ./Frontend'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t backend:${BUILD_NUMBER} ./Backend'
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Frontend production build validated during Docker image build.'
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region "$AWS_REGION" |
                    docker login --username AWS --password-stdin "$ECR_REGISTRY"

                    docker tag frontend:${BUILD_NUMBER} \
                      "$ECR_REGISTRY/$ECR_REPOSITORY:frontend-${BUILD_NUMBER}"

                    docker tag backend:${BUILD_NUMBER} \
                      "$ECR_REGISTRY/$ECR_REPOSITORY:backend-${BUILD_NUMBER}"

                    docker push "$ECR_REGISTRY/$ECR_REPOSITORY:frontend-${BUILD_NUMBER}"
                    docker push "$ECR_REGISTRY/$ECR_REPOSITORY:backend-${BUILD_NUMBER}"
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    cd /opt/docker-compose-app

                    export COMPOSE_PROJECT_NAME=first-docker-compose
                    export IMAGE_TAG="${BUILD_NUMBER}"

                    aws ecr get-login-password --region "$AWS_REGION" |
                      docker login --username AWS --password-stdin "$ECR_REGISTRY"

                    docker compose pull frontend backend
                    docker compose up -d --no-build
                '''
            }
        }
    }

    post {
        success {
            echo 'Build, push, and deployment completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
