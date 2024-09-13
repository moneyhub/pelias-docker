const mapping = {

  'aerialway': {
    '*': ['travel'],
  },

  'aeroway': {
    '*': ['travel-air'],
    'aerodrome': ['travel-air'],
    'international': ['travel-air']
  },

  'amenity': {

    'bbq': ['restaurants'],
    'dojo': ['gyms'],
    'gym': ['gyms'],

    'place_of_worship': ['charity'], // Note: there might be need for a specific 'place_of_worship' category

    'arts_centre': ['entertainment'],
    'community_centre': ['entertainment'],
    'social_centre': ['entertainment'],
    'library': ['entertainment'],
    'planetarium': ['entertainment'],
    'theatre': ['entertainment'],
    'college': ['education'],
    'kindergarten': ['education'],
    'school': ['education'],
    'university': ['education'],

    'bar': ['pub'],
    'biergarten': ['pub'],
    'cinema': ['cinema'],
    'casino': ['gambling'],
    'gambling': ['gambling'],
    'nightclub': ['pub'],
    'pub': ['pub'],

    'courthouse': ['government'],
    'embassy': ['government'],
    'fire_station': ['government'],
    'police': ['government'],
    'post_office': ['postage'],
    'ranger_station': ['government'],
    'register_office': ['government'],
    'townhall': ['government'],

    'coworking_space': ['professional'],

    'atm': ['atm'],
    'bank': ['bank'],
    'bureau_de_change': ['currency-exchange'], // NEW COUNTERPARTY CATEGORY TO BE ADDED

    'clinic': ['healthcare'],
    'dentist': ['dental'],
    'doctors': ['healthcare'],
    'hospital': ['healthcare'],
    'nursing_home': ['healthcare'],
    'pharmacy': ['retailer-pharmacy'],
    'social_facility': ['healthcare'],
    'veterinary': ['pets'],

    'cafe': ['coffee'],
    'fast_food': ['fast-food'],
    'food_court': ['restaurants'],
    'ice_cream': ['restaurants'],
    'marketplace': ['supermarket'],
    'restaurant': ['restaurants'],

    'bus_station': ['travel-vehicle'],
    'taxi': ['taxi'],

    'car_rental': ['car-rental'],
    'car_wash': ['car-maintenance'],
    'charging_station': ['car-charging'],
    'fuel': ['petrol'],

    'ferry_terminal': ['travel']
  },

  'building': {
    'hotel': ['hotel'],
    'commercial': ['local-shop'],
    'retail': ['retailer'],

    'chapel': ['charity'],
    'church': ['charity'],
    'mosque': ['charity'],
    'temple': ['charity'],
    'synagogue': ['charity'],
    'shrine': ['charity'],

    'civic': ['government'],
    'hospital': ['healthcare'],
    'school': ['education'],
    'stadium': ['entertainment'],
    'university': ['education'],
    'public': ['government'],

    'farm': ['supermarket'],

    'train_station': ['travel-rail'],
    'transportation': ['travel']
  },

  'cuisine': {
    '*': ['restaurants'],

    'bagel': ['restaurants'],
    'barbecue': ['restaurants'],
    'bougatsa': ['restaurants'],
    'burger': ['restaurants'],
    'burrito': ['restaurants'],
    'cake': ['bakery'],
    'casserole': ['restaurants'],
    'chicken': ['restaurants'],
    'coffee_shop': ['coffee'],
    'crepe': ['restaurants'],
    'couscous': ['restaurants'],
    'curry': ['restaurants'],
    'dessert': ['bakery'],
    'donut': ['bakery'],
    'empanada': ['restaurants'],
    'fish': ['restaurants'],
    'fish_and_chips': ['restaurants'],
    'fried_food': ['restaurants'],
    'gyro': ['restaurants'],
    'ice_cream': ['restaurants'],
    'kebab': ['restaurants'],
    'mediterranean': ['restaurants'],
    'noodle': ['restaurants'],
    'pancake': ['restaurants'],
    'pasta': ['restaurants'],
    'pie': ['bakery'],
    'pizza': ['restaurants'],
    'regional': ['restaurants'],
    'sandwich': ['sandwiches'],
    'sausage': ['restaurants'],
    'savory_pancakes': ['restaurants'],
    'seafood': ['restaurants'],
    'steak_house': ['restaurants'],
    'sub': ['sandwiches'],
    'sushi': ['restaurants'],
    'tapas': ['restaurants'],
    'vegan': ['restaurants'],
    'vegetarian': ['restaurants'],
    'wings': ['restaurants'],

    'african': ['restaurants'],
    'american': ['restaurants'],
    'arab': ['restaurants'],
    'argentinian': ['restaurants'],
    'asian': ['restaurants'],
    'australian': ['restaurants'],
    'baiana': ['restaurants'],
    'balkan': ['restaurants'],
    'basque': ['restaurants'],
    'bavarian': ['restaurants'],
    'belarusian': ['restaurants'],
    'brazilian': ['restaurants'],
    'cantonese': ['restaurants'],
    'capixaba': ['restaurants'],
    'caribbean': ['restaurants'],
    'chinese': ['restaurants'],
    'croatian': ['restaurants'],
    'czech': ['restaurants'],
    'danish': ['restaurants'],
    'french': ['restaurants'],
    'gaucho': ['restaurants'],
    'german': ['restaurants'],
    'greek': ['restaurants'],
    'hunan': ['restaurants'],
    'hungarian': ['restaurants'],
    'indian': ['restaurants'],
    'international': ['restaurants'],
    'iranian': ['restaurants'],
    'italian': ['restaurants'],
    'japanese': ['restaurants'],
    'korean': ['restaurants'],
    'kyo_ryouri': ['restaurants'],
    'latin_american': ['restaurants'],
    'lebanese': ['restaurants'],
    'malagasy': ['restaurants'],
    'mexican': ['restaurants'],
    'mineira': ['restaurants'],
    'okinawa_ryori': ['restaurants'],
    'pakistani': ['restaurants'],
    'peruvian': ['restaurants'],
    'polish': ['restaurants'],
    'portuguese': ['restaurants'],
    'rhenish': ['restaurants'],
    'russian': ['restaurants'],
    'shandong': ['restaurants'],
    'sichuan': ['restaurants'],
    'spanish': ['restaurants'],
    'thai': ['restaurants'],
    'turkish': ['restaurants'],
    'vietnamese': ['restaurants'],
    'westphalian': ['restaurants']
  },

  'craft': {
    '*': ['arts-and-crafts']
  },

  'emergency': {
    'ambulance_station': ['healthcare']
  },

  'historic': {
    'archaeological_site': ['tourism-experiences'],
    'monument': ['tourism-experiences']
  },

  'leisure': {
    'adult_gaming_centre': ['gaming'],
    'amusement_arcade': ['gaming'],
    'beach_resort': ['days-out'],
    'bandstand': ['entertainment'],
    'dance': ['entertainment'],

    'dog_park': ['pets'],
    'fishing': ['entertainment'],
    'garden': ['gardening'],
    'golf_course': ['sport-golf'],
    'ice_rink': ['days-out'],
    'miniature_golf': ['sport-golf'],
    'nature_reserve': ['days-out'],
    'park': ['entertainment'],
    'pitch': ['entertainment'],
    'playground': ['entertainment'],
    'sports_centre': ['gyms'],
    'stadium': ['days-out'],
    'summer_camp': ['days-out'],
    'swimming_pool': ['gyms'],
    'track': ['entertainment'],
    'water_park': ['days-out'],

    'hackerspace': ['technology']
  },

  'military': {
    '*': ['government']
  },

  'natural': {
    'wood': ['days-out'],
    'water': ['days-out'],
    'glacier': ['days-out'],
    'beach': ['days-out']
  },

  'office': {
    '*': ['professional']
  },

  'public_transport': {
    '*': ['travel'],
    'station': ['travel-rail']
  },

  'railway': {
    'light_rail': ['travel-rail'],
    'subway': ['travel-rail'],
    'tram': ['travel-rail'],
    'station': ['travel-rail']
  },

  'shop': {
    '*': ['retailer'],
    'bakery': ['bakery'],
    'butcher': ['local-shop'],
    'cheese': ['local-shop'],
    'chocolate': ['local-shop'],
    'coffee': ['coffee'],
    'deli': ['supermarket'],
    'greengrocer': ['supermarket'],
    'seafood': ['supermarket'],
    'supermarket': ['supermarket'],

    'tailor': ['clothing'],
    'copyshop': ['stationery'],
    'dry_cleaning': ['laundry'], // NEW COUNTERPARTY CATEGORY TO BE ADDED. OTHERWISE CLOTHING

    'chemist': ['pharmacy-dispensary'],
    'medical_supply': ['healthcare'],
    'optician': ['glasses']
  },

  'sport': {
    '*': ['entertainment'],
    'american_football': ['entertainment'],
    'australian_football': ['entertainment'],
    'badminton': ['entertainment'],
    'baseball': ['entertainment'],
    'basketball': ['entertainment'],
    'beachvolleyball': ['entertainment'],
    'billiards': ['entertainment'],
    'canadian_football': ['entertainment'],
    'chess': ['entertainment'],
    'cricket': ['entertainment'],
    'dog_racing': ['entertainment'],
    'field_hockey': ['entertainment'],
    'gaelic_games': ['entertainment'],
    'horse_racing': ['entertainment'],
    'ice_hockey': ['entertainment'],
    'karting': ['entertainment'],
    'rc_car': ['entertainment'],
    'rugby_league': ['entertainment'],
    'rugby_union': ['entertainment'],
    'safety_training': ['education']
  },

  'tourism': {
    'hotel': ['hotel'],
    'motel': ['hotel'],
    'alpine_hut': ['hotel'],
    'apartment': ['hotel'],
    'guest_house': ['hotel'],
    'chalet': ['hotel'],
    'caravan_site': ['tourism-experiences'],
    'camp_site': ['tourism-experiences'],
    'wilderness_hut': ['tourism-experiences'],
    'information': ['days-out'],
    'attraction': ['tourism-experiences'],
    'theme_park': ['days-out'],
    'viewpoint': ['tourism-experiences'],
    'museum': ['days-out'],
    'gallery': ['days-out'],
    'zoo': ['days-out']
  }
}

module.exports = mapping