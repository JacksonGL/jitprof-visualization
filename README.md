
# JITProf Visualization

[Wiki](https://github.com/ksen007/jalangi2analyses/wiki) | [Configuring](https://github.com/ksen007/jalangi2analyses/wiki/Configuration) | [Checkers](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Checkers) | [Develop](https://github.com/ksen007/jalangi2analyses/wiki/Developer-Guide) | [Mailing List](https://groups.google.com/forum/#!forum/dlint)

This repository contains dynamic analyses for JavaScript code based on [Jalangi2](https://github.com/Samsung/jalangi2). It mainly consists of analyses ported from [JITProf](https://github.com/Berkeley-Correctness-Group/JITProf).

What is JITProf?
----------------
JITProf is a tool that tells you which part of your JavaScript code may be slow on JIT-engine. We call those slow code **JIT-unfriendly code**.  

For more details, see this [GitHub repository](https://github.com/Berkeley-Correctness-Group/JITProf).

**Academic Resources:** [Preprint](http://www.cs.berkeley.edu/~ksen/papers/jitprof.pdf) in [ESEC/FSE'15](http://esec-fse15.dei.polimi.it/) | [Presentation Slides](http://mp.binaervarianz.de/fse2015_slides.pdf) | [Technical Report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2014/EECS-2014-144.pdf) | [Bibtex](http://mp.binaervarianz.de/fse2015.html)


Why Visualization?


![Visualization Demo](/imgs/demo2.gif?raw=true "Visualization Demo")


Install
--------------

Make sure that your computer meets these [requirements](https://github.com/ksen007/jalangi2analyses/wiki/Requirements-for-Running).  

To run analyses with Jalangi2 on real-world websites, you need to install:

 * **mitmproxy** For more details, please read [this document](https://github.com/ksen007/jalangi2analyses/wiki/Install-mitmproxy-and-Certificates).

To install, type the following commands in your console:
```
git clone https://github.com/JacksonGL/jitprof-visualization.git
cd jitprof-visualization
npm install
./scripts/install_vis.sh
```

Usage
--------------
All the following commands should be executed under directory ```jalangi2analyses/```.

### Run JITProf in Browser
```
node src/js/command/run.js jitprof
```
This command sets a web proxy, open a web page with your browser (e.g., Chrome or Safari).
Click the ```Jalangi``` button on your web page to view the analysis result.  
To close the web proxy, simply rerun the above command ([See Step-by-Step Guide](https://github.com/ksen007/jalangi2analyses/wiki/Run-Analyses-in-Browser)).

**Note:** To run JITProf and DLint on node.js, see this [Wiki page](https://github.com/ksen007/jalangi2analyses/wiki/Commands).

Configuration
----------------
To configure which analysis module to be used, see this [Wiki page](https://github.com/ksen007/jalangi2analyses/wiki/Configuration).

License
-------
DLint and JITProf is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0.html).
