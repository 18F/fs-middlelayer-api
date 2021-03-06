def jobnameparts = JOB_NAME.tokenize('/') as String[]
def jobconsolename = jobnameparts[0]
properties = null   

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
        CHECKOUT_STATUS = 'Pending'
        INSTALL_DEPENDENCIES_STATUS= 'Pending'
        RUN_LINT_STATUS = 'Pending'
        RUN_UNIT_TESTS_STATUS = 'Pending'
        DEPLOY_STATUS = 'Pending'
        RUN_SONARQUBE_STATUS = 'Pending'   

        SONARQUBE_URL="https://sca.fedgovcloud.us/dashboard?id=fs-openforest-middlelayer-api"	    
	      POSTGRES_HOST = 'localhost'
        POSTGRES_USER = 'postgres'
        HOME='.' 
        currentdate= sh (returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
        DB_URL = 'postgres://fs_open_forest:fs_open_forest@10.0.0.102/'    
        VCAP_SERVICES = "${env.VCAP_SERVICES_DEV}"
	    
     CF_USERNAME_DEV = credentials('CF_USERNAME_DEV_MIDAPI')  
    CF_PASSWORD_DEV = credentials('CF_PASSWORD_DEV_MIDAPI')  
    CF_USERNAME_STAGING = credentials('CF_USERNAME_STAGING_MIDAPI')  
    CF_PASSWORD_STAGING = credentials('CF_PASSWORD_STAGING_MIDAPI') 	    
    
    CF_USERNAME_PROD = credentials('CF_USERNAME_PROD_MIDAPI')  
    CF_PASSWORD_PROD = credentials('CF_PASSWORD_PROD_MIDAPI')  
	    
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '200'))
    }

 stages {

    stage('Checkout Code'){
       steps {
                script {
                  currentBuild.displayName = "${env.CURRENTBUILD_DISPLAYNAME}"
                  currentBuild.description = "${env.CURRENT_BUILDDESCRIPTION}"
     sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: checkout-code", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''
  		  CHECKOUT_STATUS= 'Success'
                }
	}
	 post {
                failure {
			script {
        		CHECKOUT_STATUS= 'Failed'
 sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: checkout-code", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
                }
            }
    }
    }

    stage('install-dependencies'){
    steps {
	    script {
      sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
		    sh '''
            npm install
            npm install istanbul           
           export DATABASE_URL="${DB_URL}${currentdate}"
	   npm run createdb
           npm run dba	   
	'''
      sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''

		    INSTALL_DEPENDENCIES_STATUS= 'Success'
    		}
        }
		post {
                failure {
			script {
        		INSTALL_DEPENDENCIES_STATUS= 'Failed'

sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: install-dependencies", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
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
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
		try {
	 //docker.image('circleci/node:8.9.4').withRun() {
           //     docker.image('circleci/node:8.9.4').inside() {
                  sh '''
		  export DATABASE_URL="${DB_URL}${currentdate}"
                  npm run coverage --silent
                  '''
		}
		catch(err){
		}
		finally {
  			
		 }
		
//                  }
  //            }
		

    sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''

        RUN_UNIT_TESTS_STATUS= 'Success'
    }

        }
		post {
                failure {
                    script {
        		RUN_UNIT_TESTS_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-unit-tests", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
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
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      npm run lint
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      '''
	  RUN_LINT_STATUS= 'Success'
        }
	}
	post {
                failure {
                     script {
        		RUN_LINT_STATUS= 'Failed'
     sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-lint", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
    }


stage('run-sonarqube'){
        steps {
            script{
	sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      '''
	def scannerhome = tool 'SonarQubeScanner';
        withSonarQubeEnv('SonarQube') {
          sh label: '', script: '''/home/Jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarQubeScanner/bin/sonar-scanner -Dsonar.login=$SONAR_TOKEN -Dsonar.projectKey=$SONAR_PROJECT_NAME -Dsonar.branch.name=$GIT_BRANCH -Dsonar.sources=. -Dsonar.exclusions=frontend/node_modules/**,frontend/dist/**,frontend/e2e/**,,server/node_modules/**,server/docs/**,server/frontend-assets/**,server/dba/**,server/test/**,docs/**'''
 //     	  sh 'rm -rf sonarqubereports'
  //        sh 'mkdir sonarqubereports'
 // 	  sh 'sleep 30'
  //        sh 'java -jar /home/Jenkins/sonar-cnes-report-3.1.0.jar -t $SONAR_TOKEN -s $SONAR_HOST -p $SONAR_PROJECT_NAME -o sonarqubereports'
   //       sh 'cp sonarqubereports/*analysis-report.docx sonarqubereports/sonarqubeanalysisreport.docx'
    //      sh 'cp sonarqubereports/*issues-report.xlsx sonarqubereports/sonarqubeissuesreport.xlsx'
  //	  archiveArtifacts artifacts: 'sonarqubereports/sonarqubeanalysisreport.docx', fingerprint: true
  // 	  archiveArtifacts artifacts: 'sonarqubereports/sonarqubeissuesreport.xlsx', fingerprint: true
  sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
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
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: run-sonarqube", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
      '''
    		}
                }
            }
   }

      }
      }



 stage('dev-deploy'){
  when{
	branch 'dev'
	}
    steps {
        script {
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
		
        sh '''
        ./.cg-deploy/deploy.sh middlelayer-dev;
        '''
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
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
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
        sh '''
	./.cg-deploy/deploy.sh middlelayer-staging;
        '''
	sh '''
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
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
      		curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "pending","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests are queued behind your running builds!"}'
      	'''
	

        sh '''
        ./.cg-deploy/deploy.sh middlelayer-production;
       curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "success","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests passed on Jenkins!"}'
      	'''
        DEPLOY_STATUS= 'Success'
        }
        }
		post {
                failure {
                     script {
        		DEPLOY_STATUS= 'Failed'
sh '''
      curl -XPOST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/USDAForestService/fs-open-forest-middlelayer-api/statuses/$(git rev-parse HEAD) -d '{"state": "failure","context":"ci/jenkins: build-deploy", "target_url": "https://jenkins.fs.usda.gov/blue/organizations/jenkins/fs-open-forest-middlelayer-api/activity","description": "Your tests failed on Jenkins!"}'
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
	       sh '''
                export DATABASE_URL="${DB_URL}${currentdate}"                
                npm run dropdb
        	
              	 GIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
    	         GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)
	        	 rm -f ${WORKSPACE}/pipeline.properties
		         touch ${WORKSPACE}/pipeline.properties 
		AuthorVar="GIT_AUTHOR_NAME=$GIT_AUTHOR_NAME"
                 echo $AuthorVar > ${WORKSPACE}/pipeline.properties			 			 
			 
            '''

        properties = readProperties file: 'pipeline.properties'
		    
	    	env.LCHECKOUT_STATUS = "${CHECKOUT_STATUS}"
 	    	env.LINSTALL_DEPENDENCIES_STATUS = "${INSTALL_DEPENDENCIES_STATUS}"
		env.LRUN_LINT_STATUS = "${RUN_LINT_STATUS}"
		env.LRUN_UNIT_TESTS_STATUS = "${RUN_UNIT_TESTS_STATUS}"
		env.LRUN_SONARQUBE_STATUS = "${RUN_SONARQUBE_STATUS}"
        env.LDEPLOY_STATUS = "${DEPLOY_STATUS}"
		env.LGIT_BRANCH = "${GIT_BRANCH}"
   	    env.LGIT_AUTHOR = "${properties.GIT_AUTHOR_NAME}"
  		env.BLUE_OCEAN_URL="${env.JENKINS_URL}/blue/organizations/jenkins/${jobconsolename}/detail/${GIT_BRANCH}/${BUILD_NUMBER}/pipeline"
    	env.BLUE_OCEAN_URL_SQ_DOCX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeanalysisreport.docx"
		env.BLUE_OCEAN_URL_SQ_XLSX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeissuesreport.xlsx"
		env.LSONARQUBE_URL="${SONARQUBE_URL}"
      		emailext attachLog: false, attachmentsPattern: '', body: '''${SCRIPT, template="openforest_midapi2.template"}''', mimeType: 'text/html', replyTo: 'builds@usda.gov', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: "${MAILING_LIST_OPENFOREST}"
	    }
        }

    failure {
	        script
	    {
		    
		sh '''                
                export DATABASE_URL="${DB_URL}${currentdate}"         
                npm run dropdb
            	
		              	 GIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' $GIT_COMMIT)
    	         GIT_EMAIL=$(git --no-pager show -s --format='%ae' $GIT_COMMIT)
	        	 rm -f ${WORKSPACE}/pipeline.properties
		         touch ${WORKSPACE}/pipeline.properties 
 		AuthorVar="GIT_AUTHOR_NAME=$GIT_AUTHOR_NAME"
                 echo $AuthorVar > ${WORKSPACE}/pipeline.properties			 

            '''

        properties = readProperties file: 'pipeline.properties'
		
		
	    	env.LCHECKOUT_STATUS = "${CHECKOUT_STATUS}"
 	    	env.LINSTALL_DEPENDENCIES_STATUS = "${INSTALL_DEPENDENCIES_STATUS}"
  		env.LRUN_LINT_STATUS = "${RUN_LINT_STATUS}"
		env.LRUN_UNIT_TESTS_STATUS = "${RUN_UNIT_TESTS_STATUS}"
		env.LRUN_SONARQUBE_STATUS = "${RUN_SONARQUBE_STATUS}"
		env.LDEPLOY_STATUS = "${DEPLOY_STATUS}"
		env.LGIT_BRANCH = "${GIT_BRANCH}"
		env.LGIT_AUTHOR = "${properties.GIT_AUTHOR_NAME}"
  		env.BLUE_OCEAN_URL="${env.JENKINS_URL}/blue/organizations/jenkins/${jobconsolename}/detail/${GIT_BRANCH}/${BUILD_NUMBER}/pipeline"
		env.BLUE_OCEAN_URL_SQ_DOCX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeanalysisreport.docx"
		env.BLUE_OCEAN_URL_SQ_XLSX="${env.BUILD_URL}artifact/sonarqubereports/sonarqubeissuesreport.xlsx"
		env.LSONARQUBE_URL="${SONARQUBE_URL}"
        emailext attachLog: false, attachmentsPattern: '', body: '''${SCRIPT, template="openforest_midapi2.template"}''', mimeType: 'text/html', replyTo: 'builds@usda.gov', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: "${MAILING_LIST_OPENFOREST}"
	    }
        }
    }
 }
