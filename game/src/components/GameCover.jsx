const GameCover = ({cover}) => {
    return <div className="gamecard">
        {cover && <img src = {cover.url} /> }
    </div>
}

export default GameCover;