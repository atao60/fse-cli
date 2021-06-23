#!/bin/sh

CWD=$(cd $(dirname $0); pwd)
MAKE=$0
OWNER=atao60
NAME=fse-cli
VERSION=${2:-10.15.3}
ALL_MAIN_VERSIONS="10 11 12 13 14 15 16"

TEST_IMAGE_NAME=$OWNER/$NAME-test

usage(){
cat<<-EOUSAGE
make.sh [Action]
Actions:
  build          create test image
  run            run container with full checking
  check          create test image and run full checking
  nodecheckall   iterate over the last main versions
  clean          remove all the images created by action 'nodecheckall'
EOUSAGE
}

case $1 in
  build)
    echo Node version: $VERSION
    docker build \
      --tag $TEST_IMAGE_NAME:$VERSION \
      --label $TEST_IMAGE_NAME=$VERSION \
      --build-arg NODE_VERSION=$VERSION \
      --file Dockerfile.test \
      .
    docker images --filter "dangling=true" --filter "label=$TEST_IMAGE_NAME=$VERSION" -q \
      | xargs --no-run-if-empty docker rmi 
  ;;
  run)
    docker run -it --rm $TEST_IMAGE_NAME:$VERSION
  ;;
  check)
    $MAKE build $VERSION && $MAKE run $VERSION
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
  ;;
esac
