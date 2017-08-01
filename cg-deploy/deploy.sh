set -e

export PATH=$HOME:$PATH
curl -L -o $HOME/cf.tgz "https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.26.0"
tar xzvf $HOME/cf.tgz -C $HOME
cf install-plugin -f -r CF-Community autopilot

API="https://api.fr.cloud.gov"
ORG="usda-forest-service"
SPACE=$1

if [ $# -ne 1 ]; then
echo "Usage: deploy <space>"
exit
fi

if [ $SPACE = 'api-production' ]; then
  NAME="fs-middlelayer-api"
  MANIFEST="./cg-deploy/manifests/manifest.yml"
  CF_USERNAME=$CF_USERNAME_PROD
  CF_PASSWORD=$CF_PASSWORD_PROD
elif [ $SPACE = 'api-staging' ]; then
  NAME="fs-middlelayer-api-staging"
  MANIFEST="./cg-deploy/manifests/manifest-staging.yml"
  CF_USERNAME=$CF_USERNAME_DEV
  CF_PASSWORD=$CF_PASSWORD_DEV
else
echo "Unknown space: $SPACE"
exit
fi

cf login -a $API -u $CF_USERNAME -p $CF_PASSWORD -o $ORG -s $SPACE
cf zero-downtime-push $NAME -f $MANIFEST
