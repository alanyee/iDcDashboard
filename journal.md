The goal of the project is to create an interactive data visualization framework within iPython to ease visual analysis of large data sets.  In particular I will connect the Pandas data frame to dc.js.

**November 6 2014**

Added ability for a backend to specify a set of toolbar widgets that will be displayed below the plotting area.  Added this functionality for filtering/resampling on the sampling df backend.

**November 5 2014**

Implimented a dimension object to ease configureation of dimensions.  Fixed several plots to work well.  Reimplimented the JS->Python filter passage to work under the seperate dimension domain.  

Added Python docstrings for all public methods.  Implimented plot/layer DSL so no more json config.  Got filtering to work.  Initial weather analysis demo.

**October 29 2014**

Modified dashboard so dimensions/groups are specified seperately from plots.  This provides greater freedom of defining data to plot.  Also defined a more robust plot class allowing customization.

**October 22 2014**

Added a few more plot types, this is ending up harder than expectd (possibly need a more expressive layout language).  Added ability to get filtered data frames and created a demo of a filter_callback which resmamples data as you filter.

**October 21 2014**

Got two way communication working.  Using set_data and set_layout on the widget will now erase the current data/layout and replace it with new values.
The displayed dashboard will be updated to account for the changes in data.

**October 14 2014**

Created python module capable of being imported into any notebook.  No longer needs modifications to the custom.js files to run (all libraries are now imported from a cdn).

**October 10 2014**

Modularized java script code.  Added JS->Python sending of filters as data is interacted with.

**October 8 2014**
Wrote a setup guide to install the java script libraries needed to run.

**September 28 2014**
  Today I built a dashboard widget capable which takes configureation to create a set of cross filter backed scatter plots from a single data frame.  Basic layout controls are availible by creating new "layers", or rows of plots and controlling the size of plots.  Further extension via adding new plot types/such should be easy.
 

**September 26 2014**

  Today I got a working scatter plot using dc/crossfilter in an iPython notebook widget.  Based on the [Handson Table Widget Example](http://nbviewer.ipython.org/gist/rossant/9463955) I was able to construct a widget that sends a data frame from python -> java script cross filter, creates the dc ploting div and then renders it.  Currently it statically creates a single scatter plot with an x/y axis specified at construction time.  The notebook which demonstates this is availible on [Github](https://github.com/dlisuk/masters_project/blob/master/test_pages/Scatter%20Widget%20Test.ipynb) and viewable on [NBViewer](http://nbviewer.ipython.org/github/dlisuk/masters_project/blob/master/test_pages/Scatter%20Widget%20Test.ipynb); however, nbviewer cannot display widgets so it is recomended you download the file.
  
  My next goal is to allow the construction of a more complex dashboard via a builder which will let you specify multiple plots to be backed by the data frame.  
  
**September 19 2014**

  Today I got a scatter plot working using dc.js.  Additionally I hacked around with crossfilter/dc to figure out how to add a drop down menu which lets you choose a column to use for the x/y axis of the scatter plot. I also tried to work a static scatter plot into a ipython widget but it appears I still need to understand the widget interface quite a bit better.  It is based in jQuery so my next step is to learn jQuery sufficiently to debug the problems i'm seeing.

**September 18 2014**

  Today I learned about dc.js/crossfilter/d3.js.  Following tutorials from [codeproject](http://www.codeproject.com/Articles/693841/Making-Dashboards-with-Dc-js-Part-1-Using-Crossfil), I created a basic crossfilter data set feeding a dc/d3 visaul dash board.  Unlike our previous belief it turns out crossfilter is purely a client side data structure.  I believe that this is ok since it can be used to hold the data set locally for visaulization purposes.  
  
  Also I began looking into the widgit interface for ipython.  [This page](http://nbviewer.ipython.org/gist/rossant/9463955) contains a demo widgit for an editable pandas data frame which should serve as a useful starting point.  
  
  I created a ipython notebook based on the date widget from [this page](http://nbviewer.ipython.org/github/ipython/ipython/blob/2.x/examples/Interactive%20Widgets/Custom%20Widgets.ipynb).  It shows the basic code structure needed for a basic widget.