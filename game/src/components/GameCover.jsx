const GameCover = ({ cover, onClick}) => {
    let imageUrl;
    if (cover) {
        imageUrl = `//images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
    }
    return <div className="gamecover" onClick={() => onClick(cover)}>

        {cover && <img
            src={imageUrl}
        />}


    </div>
}

export default GameCover;