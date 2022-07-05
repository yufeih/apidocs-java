pushd dotnet
dotnet build
popd

pushd java
mvn javadoc:javadoc
popd

pushd typescript
tsc index.ts
jsdoc index.js
popd
