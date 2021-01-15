const proj_folder = "dist",
  source_folder = "src";

const path = {
  build: {
    html: proj_folder + "/",
    css: proj_folder + "/css/",
    js: proj_folder + "/js/",
    img: proj_folder + "/img/",
    fonts: proj_folder + "/fonts/",
  },

  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/sass/style.sass",
    js: [source_folder + "/js/*.js", "!" + source_folder + "/js/_*.js"],
    img: source_folder + "/img/**/*",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/sass/**/*.sass",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*",
  },
  clean: "./" + proj_folder + "/",
};

const {
  src,
  dest
} = require("gulp"),
  gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  webp = require("gulp-webp"),
  webphtml = require("gulp-webp-html");

function browSync() {
  browserSync.init({
    server: {
      baseDir: "./" + proj_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}

// function clean(params) {
//   return del(path.clean);
// }

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(sass({
      outputStyle: "expanded",
    }))
    .pipe(group_media())
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true,
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
      extname: ".min.css",
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        qualiti: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

function watchFile() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

// clean
const build = gulp.series(gulp.parallel(js, css, html, images, fonts));
const watch = gulp.parallel(build, watchFile, browSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;