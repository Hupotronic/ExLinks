# E-Hentai JSON API specification

The E-Hentai JSON API can be used to request metadata information for E-Hentai Galleries. This can be done for links pointing directly to said galleries or to invididual pages in galleries.

## Basics

- **API URL:** http://g.e-hentai.org/api.php
- **Request method:** POST
- **Request type:** JSON
- **Response type:** JSON
- **Load limiting:** 25 entries per request, 4-5 sequential requests usually ok before having to wait for ~5 seconds

## API Commands and responses

### 1. Gallery metadata

This is the meat of the API - requesting gallery metadata for links. You must provide a gallery ID along with its token in order to retrieve metadata for it. Both of these can be found in a gallery's URL, which has the following format:

`http://g.e-hentai.org/g/gallery_id/gallery_token/`

For example, for http://g.e-hentai.org/g/618395/0439fa3666/ you would make the following request:

```json
{
    "method": "gdata",
    "gidlist": [
        [618395,"0439fa3666"]
    ]
}
```

To get the metadata for multiple galleries, you simply add entries to the `gidlist`. You can have 25 entries at most in a single request. The previous request, when successful, would give you the following JSON payload in response:

```json
{
  "gmetadata": [
    {
      "gid": 618395,
      "token": "0439fa3666",
      "archiver_key": "382385--9764970b04b79524bcbdc984e4c7857561397907",
      "title": "(TouKou 8) [Handful☆Happiness! (Fuyuki Nanahara)] TOUHOU GUNMANIA A2 (Touhou Project)",
      "title_jpn": "(東方紅楼夢8) [Handful☆Happiness! (七原冬雪)] TOUHOU GUNMANIA A2 (東方Project)",
      "category": "Non-H",
      "thumb": "http://gt1.ehgt.org/14/63/1463dfbc16847c9ebef92c46a90e21ca881b2a12-1729712-4271-6032-jpg_l.jpg",
      "uploader": "avexotsukaai",
      "posted": "1376143500",
      "filecount": "20",
      "filesize": 51210504,
      "expunged": false,
      "rating": "4.64",
      "torrentcount": "1",
      "tags": [
        "touhou project",
        "handful happiness",
        "fuyuki nanahara",
        "full color"
      ]
    }
  ]
}
```

If an invalid token is specified for a gallery in the original request, its entry in the `gmetadata` array will consist of just the following, however:

```json
{
   "gid":519325,
   "error":"Key missing, or incorrect key provided."
}
```

More details about the metadata keys can be found below.


### 2. Gallery tokens

Individual page links can't be used directly for requesting gallery metadata - while they contain the gallery ID, they don't have the gallery token. The `gtoken` method can be used to find the gallery token by providing the page data from the link. Page links use the following format:

`http://g.e-hentai.org/s/page_token/gallery_id-pagenumber`

Eg. for this URL: http://g.e-hentai.org/s/40bc07a79a/618395-11 you would make the following request:

```json
{
  "method": "gtoken",
  "pagelist": [
    [618395,"40bc07a79a",11]
  ]
}
```

As with the metadata requests, you can ask forfor max 25 tokens in a single request by having multiple entries in the `pagelist`. A successful request would then net you the following JSON payload in response:

```json
{
   "tokenlist": [
      {
         "gid":618395,
         "token":"0439fa3666"
      }
   ]
}
```

If any of your entries are invalid, however, you will get an `"error": "File not found"` instead of the `"token"` for that entry.

## Gallery metadata specification

While the gallery metadata is largely self-explanatory, there are some details you should be aware of.

- **`archiver_key`** - Archiver keys change every hour, but an individual key is good for up to 24 hours.
- **`category`** - Category names differ slightly from the ones used on the actual site. Here's the full list of how they are called in the API:
  * Doujinshi
  * Manga
  * Artist CG Sets
  * Game CG Sets
  * Western
  * Image Sets
  * Non-H
  * Cosplay
  * Asian Porn
  * Misc
  * Private
- **`posted`** - UNIX timestamp, UTC.
- **`filesize`** - Gallery size in bytes.
- **`tags`** - A list of the gallery tags as strings. An important thing to note is that **no namespace information is provided for the tags.** This will hopefully change in the future.