const cheerio = require('cheerio')
const axios = require('axios')

const domain = 'http://ddnews.gov.in'
const link = domain + '/hi/about/news-archive'

let newsHeadlines = [];
const newsPiece = (url, title, date, tag, imgUrl, imgDesc, paragraphs) =>
    ({ url, title, date, tag, imgUrl, imgDesc, paragraphs })


function getHtml(url, callback, errCallback){
    axios.get(url)
        .then(res => callback(cheerio.load(res.data)))
        .catch(err => errCallback(err))
}

function loadHeadlines(url, callback){
    const allNews = [];
    getHtml(url, html => {
        const headlines = html('.archive-title').toArray();

        headlines.forEach(async (hl) => {
            const url = domain + hl.parent.attribs.href
            const title = hl.children[0].data
            const date = hl.parent.children[1].children[0].data.trim()
            const tag = hl.parent.children[2].children[0].data.trim()
            
            const piece = newsPiece(url, title, date, tag)
            allNews.push(piece);
        })
        callback(allNews);
    }, err => console.log('error happened: ', err));
}

loadHeadlines(link, (allNews) => {
    newsHeadlines = [...allNews];
    console.log(newsHeadlines);
})

function getDetailedArticle(article, callback){
    getHtml(domain + article.url, html => {
        let imgSrc;

        const image1 = html(`img[title='${article.title}']`)
        const imgSrcTry1 = image1['0'].attribs.src;

        if(!imgSrcTry1){
            // const image1 = html(`img[title='${article.title}']`)
            // try other method to find image
        } else imgSrc = imgSrcTry1

        console.log(imgSrc)
    }, err => console.log(err))    
}
