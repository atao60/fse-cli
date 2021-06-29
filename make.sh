#!/bin/sh

CWD=$(cd $(dirname $0); pwd)
MAKE=$0
OWNER=atao60
NAME=fse-cli
VERSION=${2:-10.15.3}
ALL_MAIN_VERSIONS="12 14 15 16"

TEST_IMAGE_NAME=$OWNER/$NAME-test

usage(){
cat<<-EOUSAGE
make.sh [Action]
Actions:
  build          create test image
  fulltest       run full testing
  globaltest     run commands version and help of fse-cli as global npm package
  check          create test image then run full testing and global testing
  nodecheckall   iterate over the last main versions
  debug          run full testing in mode debug
  clean          remove all the images created by action 'nodecheckall'
  usage          display this help (default)
EOUSAGE
}

case $1 in
  build)
    echo ">>> Node, required version: $VERSION"
    docker build \
      --tag $TEST_IMAGE_NAME:$VERSION \
      --label $TEST_IMAGE_NAME=$VERSION \
      --build-arg NODE_VERSION=$VERSION \
      --file Dockerfile.test \
      .
    docker images --filter "dangling=true" --filter "label=$TEST_IMAGE_NAME=$VERSION" -q \
      | xargs --no-run-if-empty docker rmi 
  ;;
  fulltest)
    echo ">>> Node, effective version"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION
    echo ">>> Full Test"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION npm run test:dev:run
  ;;
  debug)
    echo ">>> Node, effective version"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION
    echo ">>> Full Test"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION "/bin/sh" "-c" "CLI_TEST_DEBUG=true npm run test:dev:run"
  ;;
  globaltest)
    echo ">>> Global Test (using link): fse version"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION "/bin/sh" "-c" "cd .. && fse version" 
    echo ">>> Global Test (using link): fse help"
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION "/bin/sh" "-c" "cd .. && fse help"
  ;;
  check)
    $MAKE build $VERSION && $MAKE fulltest $VERSION && $MAKE globaltest $VERSION
  ;;
  nodecheckall)
    for v in ${ALL_MAIN_VERSIONS}; do
      $MAKE check $v
    done
  ;;
  clean)
    docker images --filter "label=$TEST_IMAGE_NAME" -q \
      | xargs --no-run-if-empty docker rmi 
  ;;
  *)
    usage
esac
