# <%= name %>
*by <%= author %>*

<%= description %>

## Dependencies

* [pygments](http://pygments.org/) ([Docco documentation](http://jashkenas.github.com/docco/))
* [Yeoman](http://yeoman.io) (Building)
<% if (coverage) { %>
* [jscoverage](https://github.com/visionmedia/node-jscoverage) (Code coverage, docs)
<% } %>
<% if (mit) { %>

## License

MIT
<% } %>
