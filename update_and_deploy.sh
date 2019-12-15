# We first build everything
# Make sure you are in the correct folder!
git pull
yarn install
cp .env client/.env
(cd client && yarn install)
(cd client && yarn build)
rm -rf build
mv client/build build