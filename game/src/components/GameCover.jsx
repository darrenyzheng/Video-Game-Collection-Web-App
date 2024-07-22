const GameCover = ({ cover}) => {
    let imageUrl;
    if (cover) {
        imageUrl = `//images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
    }
    return <div className="gamecover" >
        {cover && <img
            src={imageUrl} alt="Game Cover"
        />}
    </div>
}

export default GameCover;