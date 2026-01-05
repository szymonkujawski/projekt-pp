const ARTISTS = ['Michael Jackson', 'Sade', 'Phil Collins', 'Lionel Richie'];

export async function fetchAlbums() {
    const responses = await Promise.all(
        ARTISTS.map((a) =>
            fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(
                    a
                )}&entity=album&limit=10`
            ).then((r) => r.json())
        )
    );

    return responses.flatMap((r) =>
        r.results.map((a) => ({
            collectionId: a.collectionId,
            title: a.collectionName,
            artist: a.artistName,
            cover: a.artworkUrl100.replace('100x100', '300x300'),
            price: Math.floor(Math.random() * 40 + 80),
            year: new Date(a.releaseDate).getFullYear(),
        }))
    );
}

export async function fetchAlbumDetails(id) {
    const res = await fetch(
        `https://itunes.apple.com/lookup?id=${id}&entity=song`
    );
    const data = await res.json();
    return data.results.slice(1).map((t) => t.trackName);
}
