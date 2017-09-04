# doca-events-api-theme

Simple events API documentation theme for [doca](https://github.com/cloudflare/doca).

It's supposed to be used in combination with [doca](https://github.com/cloudflare/doca) - a tool that scaffolds API documentation based on JSON HyperSchemas.

Please file any issues at the [doca](https://github.com/cloudflare/doca/issues) repository.

## Usage

```
npm install -g doca
doca init -t events-api
```

This creates a new API documentation with `doca-events-api-theme` as a dependency.

# Reference
This theme is based on https://github.com/cloudflare/doca-bootstrap-theme. `doca-bootstrap-theme` is aimed at documentating REST API where builds sidebar based on `links` in the JSON schema. I'm looking for a way to document events or non-REST APIs. So I modified `doca-bootstrap-theme` for my purpose. This is just a start.

The difference between `doca-bootstrap-theme` and `doca-events-api-theme` are
* `links` is not used by `doca-events-api-theme`
* `category` field is added to group events on side bar, e.g. 

```json
{
  "id": "cartitem.created",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "CartItem instance creation event",
  "description": "The event is fired when an instance of CartItem is created",
  "category": "CartItem",
  "type": "object",
  "definitions": {
    "identifier": {
      "type": "integer",
      "description": "The identifier of where the item is in the cart",
      "example": 1
    },
    "quantity": {
      "type": "number",
      "description": "The amount of product that is desired",
      "example": 2
    }
  },
  "properties": {
    "ID": {
      "$ref": "#/definitions/identifier"
    },
    "product": {
      "$ref": "./product.json"
    },
    "quantity": {
      "$ref": "#/definitions/quantity"
    }
  }
}
```
