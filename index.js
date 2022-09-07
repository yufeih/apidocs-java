const { parse } = require('node-html-parser')
const { readFileSync } = require('fs')
const { join, dirname } = require('path')

processJavadoc('D:/azure-data-appconfiguration-1.3.5-javadoc')

function processJavadoc(dir) {
  const packages = extractPackages('allpackages-index.html')
  console.log(packages);
  

  function extractPackages(href) {
    const [allPackages, baseHref] = crawlHtml('', href)
    const descriptions = allPackages.querySelectorAll('.summary-table .col-last .block').map(e => getHtml(baseHref, e))
    const packages = allPackages.querySelectorAll('.summary-table .col-first a').map((a, i) => {
      const href = a.getAttribute('href')
      const [packageSummary, baseHref] = crawlHtml(baseHref, href)
      const summary = getHtml(baseHref, packageSummary.querySelector('.package-description .block'))
      const classDescriptions = packageSummary.querySelectorAll('.summary .class-summary.col-last .block').map(e => getHtml(baseHref, e))
      const classes = packageSummary.querySelectorAll('.summary .class-summary.col-first').map((a, i) => {
        const href = a.getAttribute('href')
        return { name: a.text, href, description: classDescriptions[i] }
      })
      return { name: a.text, href, summary, description: descriptions[i] }
    })
    return packages;
  }

  function crawlHtml(baseHref, path) {
    return [parse(readFileSync(join(dir, baseHref, path), 'utf-8')).querySelector('main'), dirname(join(baseHref, path))]
  }

  function getHtml(baseHref, e) {
    const html = e.clone()
    html.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href')
      if (href && href.endsWith('.html') && !href.startsWith('/') && !href.startsWith('http:') && !href.startsWith('https:')) {
        a.setAttribute('href', join('/java/api/', dirname(baseHref), href.substring(0, href.length - 5)).replace(/\\/gi, '/'))
      }
    })
    return html.innerHTML;
  }
}