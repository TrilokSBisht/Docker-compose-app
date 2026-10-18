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
                echo 'Source code will be checked out from GitHub.'
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
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION |
                    docker login --username AWS --password-stdin $ECR_REGISTRY

                    docker tag frontend:${BUILD_NUMBER} \
                      $ECR_REGISTRY/$ECR_REPOSITORY:frontend-${BUILD_NUMBER}

                    docker tag backend:${BUILD_NUMBER} \
                      $ECR_REGISTRY/$ECR_REPOSITORY:backend-${BUILD_NUMBER}

                    docker push $ECR_REGISTRY/$ECR_REPOSITORY:frontend-${BUILD_NUMBER}
                    docker push $ECR_REGISTRY/$ECR_REPOSITORY:backend-${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo 'Build and image push completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
