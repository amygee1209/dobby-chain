test-token:
	cd ./KSEAToken && truffle test 

test-contract: 
	cd ./dobby && truffle test 

test-contract-verbose: 
	cd ./dobby && truffle test --compile-all --show-events --stacktrace-extra

test: 
	cd ./KSEAToken && truffle test 
	cd ../dobby && truffle test 

test-verbose:
	cd ./KSEAToken && truffle test --compile-all --show-events --stacktrace-extra
	cd ../dobby && truffle test --compile-all --show-events --stacktrace-extra
