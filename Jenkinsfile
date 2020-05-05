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
        JENKINS_URL="https://jenkins.fedgovcloud.us"
        SONARQUBE_URL="https://sca.fedgovcloud.us/dashboard?id=fs-openforest-middlelayer-api"
	    
	 POSTGRES_HOST = 'localhost'
       POSTGRES_USER = 'postgres'
    HOME='.' 
    currentdate= sh (returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
    DB_URL = 'postgres://fs_open_forest:fs_open_forest@localhost/fs_open_forest'
    DB_URL_Docker = 'postgres://fs_open_forest:fs_open_forest@10.0.0.102/fs_open_forest'
    VCAP_APPLICATION='{"uris":["http://localhost:8080/"]}'
	    
    VCAP_SERVICES='{"s3":[{"credentials":{"access_key_id": "AKIAKASQJKYCFNKZ7YJA","additional_buckets": [],"bucket": "cg-62009640-385b-4fb3-98c2-d4d829b98737","region": "us-gov-west-1","secret_access_key": "hbVbx4ikekICygxroYEYB/TA8e7nwpxpBBp+f45o"},"label":"s3","name":"fs-api-s3","plan":"basic","provider":null,"syslog_drain_url":null,"tags":["AWS","S3","object-storage"],"volume_mounts":[]}],"user-provided":[{"credentials":{"SUDS_API_URL":"MOCKS","password":"a","username":"b"},"label":"user-provided","name":"nrm-suds-url-service","syslog_drain_url":"","tags":[],"volume_mounts":[]},{"credentials":{"JWT_SECRET_KEY":"lkasjdfoaislkjjlkjjoqiwjf"},"label":"user-provided","name":"auth-service","syslog_drain_url":"","tags":[],"volume_mounts":[]},{"credentials":{"key":"", "app_name": "FSMIDDLELAYER"},"label":"user-provided","name":"new-relic","syslog_drain_url":"","tags":[],"volume_mounts":[]}]}'
    LOG_S3='{"access_key_id": "AKIAKNI6BAAP56PU4PAQ",  "additional_buckets": [],  "bucket": "cg-1fd744b3-4846-47ea-b7f6-24391c05b217",  "region": "us-gov-west-1",  "secret_access_key": "SO44pI3iGgmS7LZcuZOsMaI7fpV2aV5NSnjx87QL",  "uri": "s3://AKIAKNI6BAAP56PU4PAQ:SO44pI3iGgmS7LZcuZOsMaI7fpV2aV5NSnjx87QL@s3-us-gov-west-1.amazonaws.com/cg-1fd744b3-4846-47ea-b7f6-24391c05b217" }'

    CF_USERNAME_DEV = credentials('CF_USERNAME_DEV')  
    CF_PASSWORD_DEV = credentials('CF_PASSWORD_DEV')  
    CF_USERNAME_STAGING = credentials('CF_USERNAME_STAGING')  
    CF_PASSWORD_STAGING = credentials('CF_PASSWORD_STAGING')  
    CF_USERNAME_PROD = credentials('CF_USERNAME_PROD')  
    CF_PASSWORD_PROD = credentials('CF_PASSWORD_PROD')     
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
	    npm run dba
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
		
	//	 docker.image('circleci/node:8.9.4').withRun() {
         //       docker.image('circleci/node:8.9.4').inside() {
                  sh '''
                  pwd
                  ls -ltr
                  printenv                  		  
		
  	      npm run coverage
            ./node_modules/codecov/bin/codecov

                  '''
           //       }
            //  }
		

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
    steps {
        script {
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fedgovcloud.us/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
        sh '''
        pwd
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
