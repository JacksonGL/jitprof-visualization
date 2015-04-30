/*
 * Copyright (c) 2015, University of California, Berkeley and TU Darmstadt
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)
// Ported to Jalangi2 by Liang Gong

/**
 * @dlintShort{Find numerical overflows and underflows.}
 * @dlintLong{Looks for arithmetic operations where a finite value results in
 * an infinite value.}
 * @dlintPattern(unOp(*,val,\infty) WHERE val \neq \infty ORR
 * binOp(*,left,right,\infty) WHERE left \neq \infty AND right \neq \infty ORR
 * call(builtin,*,args,\infty,*) WHERE \infty \notin args}
 * @dlintRule{Avoid numeric overflow and underflow.}
 * @dlintShortName{OverflowUnderflow}
 * @dlintGroup{UncommonValue}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

// check number overflow or underflow
// procedures to add debugInfo to checker
// 1. import utils
// 2. add iidToInfo object
// 3. add addDebugInfo
// 4. call addDebugInfo
// 5. call Utils.reorganizeDebugInfo
// 6.0 var ret = ...
// 6. ret.debugInfo = iidToInfo[iid];
// 7. return ret;

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils; // import utils

        var iidToCount = {};  // iid: number --> count: number
        var iidToInfo = {} // iid: number --> info: object

        function isInfinity(x) {
            if(!(typeof x === 'number')) {
                return false;
            }

            if(x!==x) { // NaN
                return false;
            }

            if(Number.isFinite(x)) {
                return false;
            }

            return true;
        }

        function addDebugInfo(iid, msg) {
            if(!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        function isNativeFunction(f) {
            if(f && f.toString().indexOf('[native code]')>=0)
                return true;
            return false;
        }

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            iid = sandbox.getGlobalIID(iid);
            if (isNativeFunction(f) && isInfinity(result)) {
                for(var i=0;i<args.length;i++){
                    if(isInfinity(args[i])) {
                       return ; 
                    }
                }
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'function ' + f.constructor.name + ' returns ' + result);
            }
        };

        /*
        this.getField = function(iid, base, offset, val) {
            if (isInfinity(val)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };
        */

        this.binary = function(iid, op, left, right, result) {
            iid = sandbox.getGlobalIID(iid);
            if (!(isInfinity(left)) && !(isInfinity(right)) && isInfinity(result)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' left: ' + left + ' | op: ' + op + ' | right:' + right + ' --> ' + result);
            }
        };

        this.unary = function(iid, op, left, result) {
            iid = sandbox.getGlobalIID(iid);
            if (!isInfinity(left) && isInfinity(result)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' unary opearnd: ' + left + ' | op: ' + op + ' --> ' + result);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("CheckOverflow", iid, location, "Observed Overflow (underflow) at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



