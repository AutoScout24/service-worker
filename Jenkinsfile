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
    ECRACCOUNTID="544725753551"
    // USECASE="service-worker"
    // SEGMENT="cxp"
    // TEAM="acquisition"
    // VERTICAL="as24"
  }

  stages {
    stage('Build') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'deploy-as24dev-node' } }

      steps {
        sh './deploy/build.sh'
        stash includes: 'dist/**/*', name: 'output-dist'
      }
    }

    // stage('DeployDev') {
    //   when {
    //     beforeAgent true
    //     branch 'master'
    //   }

    //   environment {
    //     ACCOUNT_NAME=as24dev
    //     CPU=64
    //     MEMORY=96
    //   }

    //   agent { node { label 'deploy-as24dev' } }

    //   steps {
    //     sh 'AccountName=as24dev Prefix=dev- EnvironmentName=dev ./deploy/deploy.sh'
    //   }
    // }

    // stage('DeployProd') {
    //   when {
    //     beforeAgent true
    //     branch 'master'
    //   }

    //   environment {
    //     ACCOUNT_NAME=as24dev
    //     CPU=256
    //     MEMORY=256
    //   }

    //   agent { node { label 'deploy-as24prod' } }
    //   steps {
    //     sh 'AccountName=as24prod EnvironmentName=prod ./deploy/deploy.sh'
    //   }
    // }
  }
}