pipeline {
    agent any

    environment {
        // Define the Node.js version you want to use
        NODE_VERSION = '20.x'
        // Docker registry variables (UPDATE THESE)
        DOCKER_REGISTRY = 'your-docker-registry.com' // e.g., 'docker.io/myuser'
        IMAGE_NAME = "snack-shack"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FULL_IMAGE_NAME = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        // --- 1. Checkout Stage 📥 ---
        stage('Checkout') {
            steps {
                echo 'Checking out Snack Shack source code...'
                // git url: 'your-repository-url', branch: 'main'
            }
        }
        
        // --- 2. Build Docker Image 📦 ---
        stage('Build Docker Image') {
            steps {
                // Ensure a Dockerfile is present in the repository root.
                // A common practice is to use a multi-stage build.
                sh "docker build -t ${FULL_IMAGE_NAME} ."
            }
        }
        
        // --- 3. Run Unit Tests (Placeholder) 🧪 ---
        // Always include a test stage for real projects, even if it's empty now.
        stage('Test (Placeholder)') {
            steps {
                echo 'No unit tests defined in package.json. Skipping test execution.'
                // In a real project: sh 'docker run --rm ${FULL_IMAGE_NAME} npm test'
            }
        }
        
        // --- 4. Push to Registry (Optional) 🚀 ---
        stage('Push Image') {
            // This stage requires Jenkins credentials for your Docker Registry (e.g., Docker Hub)
            when {
                // Only execute if the branch is 'main' or similar condition
                expression { return env.BRANCH_NAME == 'main' }
            }
            steps {
                // Use the 'withCredentials' binding for secure login
                // Replace 'docker-hub-credentials' with your actual Jenkins ID
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials', 
                        passwordVariable: 'DOCKER_PASSWORD', 
                        usernameVariable: 'DOCKER_USERNAME'
                    )]) {
                        sh "echo ${DOCKER_PASSWORD} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"
                        sh "docker push ${FULL_IMAGE_NAME}"
                    }
                }
            }
        }
        
        // --- 5. Deploy (Optional) 🌐 ---
        stage('Deploy') {
            steps {
                echo "Deployment logic (e.g., pulling the image on a Kubernetes cluster or remote server) goes here."
                // sh "ssh user@target-host 'docker pull ${FULL_IMAGE_NAME} && docker run -d -p 3000:3000 ${FULL_IMAGE_NAME}'"
            }
        }
    }

    // --- Post-Build Actions 🔔 ---
    post {
        always {
            // Clean up the workspace
            deleteDir()
        }
        success {
            echo 'Snack Shack pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}
