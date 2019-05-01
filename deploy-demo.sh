#!/bin/bash

function try {
	"$@"
	local status=$?
	if [ $status -ne 0 ]; then
		echo "!!!Error!!! with $1" >&2
		exit $status
	fi
	return $status
}

rm -rf build/
try npm run build
try cd build/
git init
git add -A .
git commit -m "Deploy"
git remote add origin https://github.com/rodri042/quickp2p
git push -f origin master:gh-pages
