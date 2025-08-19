export default function CertificateCarousel() {
    return (
        <div className="carousel w-4/5 shadow-lg shadow-stone-500 rounded-lg transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            <div id="slide2" className="carousel-item relative w-full">
                <img
                src="lash_certi.png"
                className="w-full" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"></div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
                <img
                src="/nails_certi.png"
                className="w-full" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"></div>
            </div>
        </div>
    )
}