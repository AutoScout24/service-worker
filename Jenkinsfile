pipeline {
  // Execute the pipeline on the master, stages will still be executed on the agents
  agent none 

  options {
    timestamps() // Enable timestamps in the build log
    disableConcurrentBuilds() // The pipeline should run only once at a time
  }

  // Environment variables for all stages
  environment {
    AWS_DEFAULT_REGION="eu-west-1"
    SERVICE="service-worker"
  }

  stages {
    stage('Build') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'build-node' } }

      steps {
        sh './deploy/build.sh'
        stash includes: 'service-worker/**/*', name: 'output-dist'
      }
    }

    stage('DeployDev') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
        ACCOUNT_NAME='as24dev'
      }

      agent { node { label 'deploy-as24dev' } }

      steps {
        unstash 'output-dist'
        sh './deploy/deploy.sh'
      }
    }

    stage('DeployProd') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
        ACCOUNT_NAME='as24dev'
      }

      agent { node { label 'deploy-as24prod' } }
      steps {
        unstash 'output-dist'
        // sh './deploy/deploy.sh'
      }
    }

    post { 
      failure { 
          echo 'service-worker pipeline failed 💣'
      }
    }
  }
}
