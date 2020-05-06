def jobnameparts = JOB_NAME.tokenize('/') as String[]
def jobconsolename = jobnameparts[0]

pipeline {
    agent {
    node {
    label 'linuxworker1'
        }
    }

    environment {
        CURRENTBUILD_DISPLAYNAME = "fs-open-forest-middlelayer-api Build #$BUILD_NUMBER"
        CURRENT_BUILDDESCRIPTION = "fs-open-forest-middlelayer-api Build #$BUILD_NUMBER"
        SONAR_HOST = credentials('SONAR_HOST')
	    SONAR_TOKEN = credentials('SONAR_TOKEN_FSOPENFORESTMID')
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        GITHUB_PROJECT_NAME = "USDAForestService/fs-open-forest-middlelayer-api"
        SONAR_PROJECT_NAME = "fs-openforest-middlelayer-api"
        MAILING_LIST = 'ikumarasamy@techtrend.us'

        CHECKOUT_STATUS = 'Pending'
        INSTALL_DEPENDENCIES_STATUS= 'Pending'
        RUN_LINT_STATUS = 'Pending'
        RUN_UNIT_TESTS_STATUS = 'Pending'
        DEPLOY_STATUS = 'Pending'
        RUN_SONARQUBE_STATUS = 'Pending'

        BASIC_AUTH_PASS=credentials('BASIC_AUTH_PASS')
        BASIC_AUTH_USER=credentials('BASIC_AUTH_USER')
	CF_USERNAME_DEV=credentials('CF_USERNAME_DEV_MIDAPI')
        CF_PASSWORD_DEV=credentials('CF_PASSWORD_DEV_MIDAPI')
	VCAP_SERVICES=credentials('VCAP_SERVICES_MIDAPI')
	LOG_S3=credentials('LOG_S3_MIDAPI')
	    
	    
        JENKINS_URL="https://jenkins.fedgovcloud.us"
        SONARQUBE_URL="https://sca.fedgovcloud.us/dashboard?id=fs-openforest-middlelayer-api"
	    
	 POSTGRES_HOST = 'localhost'
       POSTGRES_USER = 'postgres'
    HOME='.' 
    currentdate= sh (returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
    DB_URL = 'postgres://fs_open_forest:fs_open_forest@localhost/fs_open_forest'
    DB_URL_Docker = 'postgres://fs_open_forest:fs_open_forest@10.0.0.102/fs_open_forest'    

    }

    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '50'))
    }

 stages {

    stage('Checkout Code'){
       steps {
                script {
                  currentBuild.displayName = "${env.CURRENTBUILD_DISPLAYNAME}"
                  currentBuild.description = "${env.CURRENT_BUILDDESCRIPTION}"
     sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: checkout-code", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''
  		  CHECKOUT_STATUS= 'Success'
                }
	}
	 post {
                failure {
			script {
        		CHECKOUT_STATUS= 'Failed'
 sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: checkout-code", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
                }
            }
    }
    }

    stage('install-dependencies'){
    steps {
	    script {
      sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
		    sh '''
            npm install
            npm install istanbul           
            export DATABASE_URL="${DB_URL}"		
	    #npm run dba
	'''
      sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-apimiddlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''

		    INSTALL_DEPENDENCIES_STATUS= 'Success'
    		}
        }
		post {
                failure {
			script {
        		INSTALL_DEPENDENCIES_STATUS= 'Failed'

sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }

stage('run tests')
	  {
      parallel{

stage('run-unit-tests'){
    steps {
        script {
  sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
		
	 docker.image('circleci/node:8.9.4').withRun() {
                docker.image('circleci/node:8.9.4').inside() {
                  sh '''
                  pwd
		  export DATABASE_URL="${DB_URL}"		
                  ls -ltr		
                  '''
                  }
              }
		

    sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''

        RUN_UNIT_TESTS_STATUS= 'Success'
    }

        }
		post {
                failure {
                    script {
        		RUN_UNIT_TESTS_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }


     stage('run-lint'){
    steps {
        script
        {
 sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
		   sh '''
	            pwd	    
	            npm run lint
    	   '''
    sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''
	        RUN_LINT_STATUS= 'Success'
        }
	}
	post {
                failure {
                     script {
        		RUN_LINT_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }


stage('run-sonarqube'){
        steps {
            script{
	sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
	def scannerhome = tool 'SonarQubeScanner';
        withSonarQubeEnv('SonarQube') {
          sh label: '', script: '''/home/Jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarQubeScanner/bin/sonar-scanner -Dsonar.login=$SONAR_TOKEN -Dsonar.projectKey=$SONAR_PROJECT_NAME -Dsonar.sources=. -Dsonar.exclusions=frontend/node_modules/**,frontend/dist/**,frontend/e2e/**,,server/node_modules/**,server/docs/**,server/frontend-assets/**,server/dba/**,server/test/**,docs/**'''
      	  sh 'rm -rf sonarqubereports'
          sh 'mkdir sonarqubereports'
  	  sh 'sleep 30'
          sh 'java -jar /home/Jenkins/sonar-cnes-report-3.1.0.jar -t $SONAR_TOKEN -s $SONAR_HOST -p $SONAR_PROJECT_NAME -o sonarqubereports'
          sh 'cp sonarqubereports/*analysis-report.docx sonarqubereports/sonarqubeanalysisreport.docx'
          sh 'cp sonarqubereports/*issues-report.xlsx sonarqubereports/sonarqubeissuesreport.xlsx'
  	  archiveArtifacts artifacts: 'sonarqubereports/sonarqubeanalysisreport.docx', fingerprint: true
   	  archiveArtifacts artifacts: 'sonarqubereports/sonarqubeissuesreport.xlsx', fingerprint: true
  sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''
		        RUN_SONARQUBE_STATUS= 'Success'
            }
            }
    }
	post {
                failure {
                       script {
        		RUN_SONARQUBE_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''

    		}
                }
            }
   }

      }
      }



 stage('dev-deploy'){
  when{
	branch 'jenkins_build'
	}
    steps {
        script {
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
        sh '''
        pwd
	export CF_USERNAME_DEV="${CF_USERNAME_DEV}"		
	    export CF_PASSWORD_DEV="${CF_PASSWORD_DEV}"		
	    export VCAP_SERVICES="${VCAP_SERVICES}"		
	    export LOG_S3="${LOG_S3}"		
        ./.cg-deploy/deploy.sh middlelayer-dev;
        '''
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }

    stage('staging-deploy'){
  when{
	branch 'staging'
	}
    steps {
        script {
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
        sh '''
        pwd
	export CF_USERNAME_DEV="${CF_USERNAME_DEV}"		
	    export CF_PASSWORD_DEV="${CF_PASSWORD_DEV}"		
	    export VCAP_SERVICES="${VCAP_SERVICES}"		
	    export LOG_S3="${LOG_S3}"		
        ./.cg-deploy/deploy.sh middlelayer-staging;
        '''
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }

    stage('prod-deploy'){
  when{
	branch 'master'
	}
    steps {
        script {
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
        sh '''
        pwd
	export CF_USERNAME_DEV="${CF_USERNAME_DEV}"		
	    export CF_PASSWORD_DEV="${CF_PASSWORD_DEV}"		
	    export VCAP_SERVICES="${VCAP_SERVICES}"		
	    export LOG_S3="${LOG_S3}"		
        ./.cg-deploy/deploy.sh middlelayer-prod1;
        '''
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }
 }

post{
    success {
	    script
	    {		    
	    	env.LCHECKOUT_STATUS = "${CHECKOUT_STATUS}"
 	    	env.LINSTALL_DEPENDENCIES_STATUS = "${INSTALL_DEPENDENCIES_STATUS}"
		env.LRUN_LINT_STATUS = "${RUN_LINT_STATUS}"
		env.LRUN_UNIT_TESTS_STATUS = "${RUN_UNIT_TESTS_STATUS}"
		env.LRUN_SONARQUBE_STATUS = "${RUN_SONARQUBE_STATUS}"
        env.LDEPLOY_STATUS = "${DEPLOY_STATUS}"
		env.LGIT_BRANCH = "${GIT_BRANCH}"
  		env.BLUE_OCEAN_URL="${env.JENKINS_URL}/blue/organizations/jenkins/${jobconsolename}/detail/${GIT_BRANCH}/${BUILD_NUMBER}/pipeline"
    	env.BLUE_OCEAN_URL_SQ_DOCX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeanalysisreport.docx"
		env.BLUE_OCEAN_URL_SQ_XLSX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeissuesreport.xlsx"
		env.LSONARQUBE_URL="${SONARQUBE_URL}"
      		emailext attachLog: false, attachmentsPattern: '', body: '''${SCRIPT, template="openforestmidapi.template"}''', mimeType: 'text/html', replyTo: 'builds@usda.gov', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: "${MAILING_LIST}"
	    }
        }

    failure {
	        script
	    {
		    
		    
	    	env.LCHECKOUT_STATUS = "${CHECKOUT_STATUS}"
 	    	env.LINSTALL_DEPENDENCIES_STATUS = "${INSTALL_DEPENDENCIES_STATUS}"
  		env.LRUN_LINT_STATUS = "${RUN_LINT_STATUS}"
		env.LRUN_UNIT_TESTS_STATUS = "${RUN_UNIT_TESTS_STATUS}"
		env.LRUN_SONARQUBE_STATUS = "${RUN_SONARQUBE_STATUS}"
		env.LDEPLOY_STATUS = "${DEPLOY_STATUS}"
		env.LGIT_BRANCH = "${GIT_BRANCH}"
		env.LGIT_AUTHOR = "${AUTHOR}"
  		env.BLUE_OCEAN_URL="${env.JENKINS_URL}/blue/organizations/jenkins/${jobconsolename}/detail/${GIT_BRANCH}/${BUILD_NUMBER}/pipeline"
		env.BLUE_OCEAN_URL_SQ_DOCX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeanalysisreport.docx"
		env.BLUE_OCEAN_URL_SQ_XLSX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeissuesreport.xlsx"
		env.LSONARQUBE_URL="${SONARQUBE_URL}"
        emailext attachLog: false, attachmentsPattern: '', body: '''${SCRIPT, template="openforestmidapi.template"}''', mimeType: 'text/html', replyTo: 'builds@usda.gov', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: "${MAILING_LIST}"
	    }
        }
    }
 }
