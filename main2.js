/*
1. Render songs
2. Scroll top
3. play / pause / seek
4. CD rotate ------------------
5. Next / prev => OK
6. Random => OK
7. Next / Repeat when ended => OK
8. Active song => OK
9. Scroll active song into view
10. Play song when click
 */


const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)
const heading = $('header h2')
const background = $('.cd-thumb')
const audio = $("#audio")
const cd = $('.cd')
const PlayBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next')
const progress = $('#progress')
const cdThumb = $('.cd-thumb')
const preiousBtn = $('.btn-prev')
const randomBnt = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playListBtn = $('.playlist')


const app = {
    currentIndex: 0,
    is_Playing: false,
    is_Random: false,
    is_Repeat: false,
    songs: [
        {
            name: "Chúng ta Sau Này",
            singer: "T.R.I",
            path: "songs/song1.mp3",
            image: "/img/song1.jpg"
        },
        {
            name: "Tháng Mấy Em Nhớ Anh",
            singer: "Hà Anh Tuấn",
            path: "songs/song2.mp3",
            image: "/img/song2.jpg"
        },
        {
            name: "TÌnh Bạn Diệu Kỳ",
            singer: "Amme",
            path: "songs/song3.mp3",
            image: "/img/song3.jpg"
        },
        {
            name: "Trên Tình bạn Dưới Tình Yêu",
            singer: "MIN",
            path: "songs/song4.mp3",
            image: "/img/song4.jpg"
        },
        {
            name: "Yêu Thầm",
            singer: "Hoàng Yến",
            path: "songs/song5.mp3",
            image: "/img/song5.jpg"
        },
        {
            name: "Sài Gòn Đau Lòng Quá",
            singer: "Hứa Minh Tuyền",
            path: "songs/song6.mp3",
            image: "/img/song6.jpg"
        },
        {
            name: "Phải Chăng Em Đã Yêu",
            singer: "Juky San",
            path: "songs/song7.mp3",
            image: "/img/song7.jpg"
        },
        {
            name: "Hết Duyên Tình Tan",
            singer: "Châu Khải Phong",
            path: "songs/song8.mp3",
            image: "/img/song8.jpg"
        },
        {
            name: "Ép Duyên",
            singer: "T.R.I",
            path: "songs/song9.mp3",
            image: "/img/song9.jpg"
        },
        {
            name: "Đừng Hẹn Kiếp Sau",
            singer: "Đình Dũng",
            path: "songs/song10.mp3",
            image: "/img/song10.jpg"
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ?'active':''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playListBtn.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWith = cd.offsetWidth
        // xử lí phóng to
        document.onscroll = function () {
            const srollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWith - srollTop
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWith
        },
        // xử lí khi click play
        PlayBtn.onclick = function () {
                if (_this.is_Playing) {
                    audio.pause()
                }
                else {
                    audio.play()
                }
        }
        // khi bài hát đc play
        audio.onplay = function () {
            _this.is_Playing = true;
            player.classList.add('playing')
            cdThumbPhu.play()
        }
        // khi bài hát bị pause
        audio.onpause = function () {
            _this.is_Playing = false;
            player.classList.remove('playing')
            cdThumbPhu.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            if (audio.ended == true) {
                if (_this.is_Repeat) {
                    _this.rePeat()
                    _this.render()
                    _this.topActiveSong()
                }
                else if (_this.Random) {
                    _this.random()
                    _this.render()
                    _this.topActiveSong()
                }
                else {
                    _this.nextSong()
                    _this.render()
                    _this.topActiveSong()
                }
            }
        }
        // Tua bài hát 
        progress.onchange = function (e) {
            const seekTime = progress.value * audio.duration / 100
            audio.currentTime = seekTime
        }
        // đĩa quay
        const cdThumbPhu = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbPhu.pause()
        // khi chuyển tới bài hát tiếp theo
        nextBtn.onclick = function () {
            if (_this.Random) {
                _this.random()
            }
            else {
                _this.nextSong()
            }
            _this.render()
            _this.topActiveSong()
        }
        // khi <<< lui bài hát
        preiousBtn.onclick = function () {
            if (_this.Random) {
                _this.random()
            }
            else {
                _this.PreSong()
            }
            _this.render()
            _this.topActiveSong()
        }
        // khi random bài hát
        randomBnt.onclick = function () {
            _this.Random = !_this.Random
            randomBnt.classList.toggle('active', _this.Random)
        }
        repeatBtn.onclick = function () {
            _this.is_Repeat = !_this.is_Repeat
            repeatBtn.classList.toggle('active', _this.Repeat)
        }
        playListBtn.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option')){
            /// khi click vao bao khac
            if(songNode){
                _this.currentIndex = Number(songNode.getAttribute('data-index'))
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
            /// khi click vao  ba cham ...
            if(e.target.closest('.option')){
            }
        }
        }

    },
    rePeat: function () {
        audio.currentTime = 0;
        this.loadCurrentSong();
        audio.play();
    },
    random: function () {
        var count;
        do {
            count = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === count)
        this.currentIndex = count
        this.loadCurrentSong()
        audio.play()
        
    },
    // khi click vao Playlist
    topActiveSong: function () {
      setTimeout(function () {
        $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
      },100)  
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        background.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
        audio.play()
    },
    PreSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        audio.play()

    },
    start: function () {
        this.defineProperties()// định nghĩa các thuộc tính cho Object
        this.handleEvents()
        this.render() // render playlist
        this.loadCurrentSong()
    }
}
app.start()



