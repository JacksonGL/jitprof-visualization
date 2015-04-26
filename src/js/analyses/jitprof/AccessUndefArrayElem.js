/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong
// Ported to Jalangi2 by Koushik Sen

/**
 * Check Rule: Do not load undefined array elements from an array
 *
 * Loading an undefined element from an array can be 40X slower than loading
 * a defined array element on V8 engine.
 *
 * for example:
 * var arr = [];
 * while(arr[i]) { // this is very inefficient
 *     // do something
 *     i++;
 * }
 *
 * This analysis monitors detect source locations that gets undefined elements
 * from array.
 */

((function (sandbox) {
    function AccessUndefArrayElem() {
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var iidToLocation = sandbox.iidToLocation;
        var sort = Array.prototype.sort;

        var RuntimeDB = sandbox.RuntimeDB;
        var db = new RuntimeDB();
        var Utils = sandbox.Utils;

        var warning_limit = 30;
        var ACCESS_THRESHOLD = 0;

        // ---- JIT library functions start ----

        function checkIfReadingAnUninitializedArrayElement(base, offset, iid) {
            if (Utils.isArr(base)) {
                // check using uninitialized
                if (Utils.isNormalNumber(offset) && !HOP(base, offset + '')) {
                    db.addCountByIndexArr(['JIT-checker', 'uninit-array-elem', sandbox.getGlobalIID(iid)]);
                }
            }
        }


        // ---- JIT library functions end ----

        this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            if (base) {
                checkIfReadingAnUninitializedArrayElement(base, offset, iid);
            }
        };


        this.endExecution = function () {
            this.printResult();
        };

        this.printResult = function () {
            try {
                sandbox.log("---------------------------");

                sandbox.log('<b>Report of loading undeclared or deleted array elements:</b>')
                var uninitArrDB = db.getByIndexArr(['JIT-checker', 'uninit-array-elem']);
                var num = 0;
                var jitUninitArr = [];
                for (var prop in uninitArrDB) {
                    if (HOP(uninitArrDB, prop)) {
                        if(uninitArrDB[prop].count > ACCESS_THRESHOLD) {
                            jitUninitArr.push({'iid': prop, 'count': uninitArrDB[prop].count});
                            num++;
                        }
                    }
                }
                sort.call(jitUninitArr, function compare(a, b) {
                    return b.count - a.count;
                });

                for (var i = 0; i < jitUninitArr.length && i < warning_limit; i++) {
                    sandbox.log(' * [location: ' + iidToLocation(jitUninitArr[i].iid) + ']: <br/> &nbsp; Number of usages: ' + jitUninitArr[i].count);
                }
                sandbox.log('...');
                sandbox.log('Number of loading undeclared or deleted array elements spotted: ' + num);
                sandbox.log('[****]AccessUndefArrayElem: ' + num);

            } catch (e) {
                console.log("error!!");
                console.log(e);
            }
        }
    }

    sandbox.analysis = new AccessUndefArrayElem();

})(J$));