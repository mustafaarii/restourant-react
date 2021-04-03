export default function turkishDateFormat(date) {
        const months = [ "Ocak", "Şubat", "Mart",
        "Nisan", "Mayıs", "Haziran", "Temmuz",
        "Ağustos", "Eylül", "Ekim",
        "Kasım", "Aralık"]
        

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hours = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        let time = hours + " : " + minutes
        
        const format = ""+ day + " " + months[month] + " " + year + " - " + time + "";
        return format;
    
}