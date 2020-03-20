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

    stage('confirm') {
      when {
        beforeAgent true
        branch 'master'
      }
      agent none
      steps {
        input message: "Are you sure you want to got to production?"
      }
    }

    stage('DeployProd') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
         ACCOUNT_NAME='as24prod'
      }

      agent { node { label 'deploy-as24prod' } }
      steps {
        unstash 'output-dist'
        sh './deploy/deploy.sh'
      }
    }
  }

  post { 
    failure { 
      slackSend channel: 'as24_acq_cxp_fizz', color: '#FF0000', message: "💣 ${env.JOB_NAME} [${env.BUILD_NUMBER}] failed. (<${env.BUILD_URL}|Open>)"
    }
    fixed {
      slackSend channel: 'as24_acq_cxp_fizz', color: '#00FF00', message: "💣 ${env.JOB_NAME} [${env.BUILD_NUMBER}] recovered. (<${env.BUILD_URL}|Open>)"
    }

  }
}
