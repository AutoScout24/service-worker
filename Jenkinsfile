pipeline {
  // Execute the pipeline on the master, stages will still be executed on the agents
  agent none 

  options {
    timestamps() // Enable timestamps in the build log
    disableConcurrentBuilds() // The pipeline should run only once at a time
    preserveStashes(buildCount: 5)
  }

  // Environment variables for all stages
  environment {
    AWS_DEFAULT_REGION="eu-west-1"
    SERVICE="service-worker"
    SERVICE_BUCKET_NAME="as24-service-worker"
    USECASE="as24-company-pages"
    SEGMENT="user-growth-tech"
    TEAM="ug-activation"
    VERTICAL="as24"
  }

  stages {
    stage('Build') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'build-as24assets' } }

      steps {
        sh './deploy/build.sh'
        stash includes: 'service-worker/**/*', name: 'output-dist'
      }
    }

    stage('Deploy') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'deploy-as24assets' } }
      steps {
        unstash 'output-dist'
        sh './deploy/deploy.sh'
      }
    }
  }

  post { 
    failure { 
      slackSend channel: 'ug-activation-alerts', color: '#FF0000', message: "💣 ${env.JOB_NAME} [${env.BUILD_NUMBER}] failed. (<${env.BUILD_URL}|Open>)"
    }
    fixed {
      slackSend channel: 'ug-activation-alerts', color: '#00FF00', message: "💣 ${env.JOB_NAME} [${env.BUILD_NUMBER}] recovered. (<${env.BUILD_URL}|Open>)"
    }

  }
}
