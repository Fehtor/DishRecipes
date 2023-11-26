let cards = document.querySelectorAll(".card")
let input = document.querySelector(".search-text")
let meals = document.querySelectorAll(".meal")
let curMeal = "All"
console.log(input)

function jaro_distance(s1, s2)
    {
        // If the strings are equal
        if (s1 == s2)
            return 1.0;
      
        // Length of two strings
        let len1 = s1.length, len2 = s2.length;
      
        if (len1 == 0 || len2 == 0)
            return 0.0;
      
        // Maximum distance upto which matching
        // is allowed
        let max_dist = Math.floor(Math.max(len1, len2) / 2) - 1;
      
        // Count of matches
        let match = 0;
      
        // Hash for matches
        let hash_s1 = new Array(s1.length);
        hash_s1.fill(0);
        let hash_s2 = new Array(s2.length);
        hash_s2.fill(0);
      
        // Traverse through the first string
        for (let i = 0; i < len1; i++)
        {
      
            // Check if there is any matches
            for (let j = Math.max(0, i - max_dist);
                j < Math.min(len2, i + max_dist + 1); j++)
                  
                // If there is a match
                if (s1[i] == s2[j] &&
                    hash_s2[j] == 0)
                {
                    hash_s1[i] = 1;
                    hash_s2[j] = 1;
                    match++;
                    break;
                }
        }
      
        // If there is no match
        if (match == 0)
            return 0.0;
      
        // Number of transpositions
        let t = 0;
      
        let point = 0;
      
        // Count number of occurrences
        // where two characters match but
        // there is a third matched character
        // in between the indices
        for (let i = 0; i < len1; i++)
            if (hash_s1[i] == 1)
            {
      
                // Find the next matched character
                // in second string
                while (hash_s2[point] == 0)
                    point++;
      
                if (s1[i] != s2[point++])
                    t++;
            }
        t /= 2;
      
        // Return the Jaro Similarity
        return ((match) / (len1)
                + (match) / (len2)
                + (match - t) / (match))
            / 3.0;
    }
      
function jaro_Winkler(s1, s2)
    {
        let jaro_dist = jaro_distance(s1, s2);
      
        // If the jaro Similarity is above a threshold
        if (jaro_dist > 0.7)
        {
      
            // Find the length of common prefix
            let prefix = 0;
      
            for (let i = 0; i < Math.min(s1.length,s2.length); i++)
            {
                  
                // If the characters match
                if (s1[i] == s2[i])
                    prefix++;
      
                // Else break
                else
                    break;
            }
      
            // Maximum of 4 characters are allowed in prefix
            prefix = Math.min(4, prefix);
      
            // Calculate jaro winkler Similarity
            jaro_dist += 0.1 * prefix * (1 - jaro_dist);
        }
        return jaro_dist.toFixed(6);
    }

function changeMeal(event){
    let eventId = event.currentTarget.getAttribute("id")
    curMeal = eventId
    for(let i = 0; i < meals.length; i++){
        let itemId = meals[i].getAttribute("id")
        if(eventId == itemId){
            meals[i].classList.add("meal-clicked")
        }
        else{
            meals[i].classList.remove("meal-clicked")
        }   
    }
    defaultState()
}

function changeState(){
    let name = input.value
    if(name == ""){
        defaultState()
        return
    }
    for(let i = 0; i < cards.length; i++){
        let cardName = cards[i].getAttribute("name")
        let cardMealType = cards[i].getAttribute("mealType")
        if(cardMealType == curMeal || curMeal == "All"){
            if(jaro_Winkler(name, cardName) >= 0.75){
                cards[i].classList.remove("display-none")
            }
            else{
                cards[i].classList.add("display-none")
            }
        }
    }
}

function defaultState(){
    for(let i = 0; i < cards.length; i++){
        let cardMealType = cards[i].getAttribute("mealType")
        if(cardMealType != curMeal){
            cards[i].classList.add("display-none")
        }
        else{
            cards[i].classList.remove("display-none")
        }
        if(curMeal == "All"){
            cards[i].classList.remove("display-none")
        }
    }
}

input.addEventListener("input", changeState)
for(let i = 0; i < meals.length; i++){
    meals[i].addEventListener("click", changeMeal)
}