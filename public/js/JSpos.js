// SoundCaisse
var bleep = new Audio();
bleep.src = "/sound/soundCaisse.wav";

function loadContent(){
    bleep.play();
}
// Fin SoundCaisse

$('button.addClientButton').click( function() {
  $('form.addClientForm').submit();
});

$('button.searchProductButton').click( function() {
  $('form.searchProducForm').submit();
});


$('button.ticketProductButton').click( function() {
  $('form.ticketProducForm').submit();
});



//pos 
      
    //Ajouter produit à partir de la liste (add to cart)
    $('button.searchProducCartButton').click( function() {
      $('form.searchProducCartForm').submit();
    });

    //Boutton ajouter un Client à partir de pos  
    $('button.addClientButtonPOS').click( function() {
      $('form.addClientFormPOS').submit();
    });

    


      //Ajouter la remise du client
      $('button.searchClientCbareButton').click( function() {
        $('form.searchClientCbareForm').submit();
      });


      //Boutton Annuler le ticket ( vide la liste )
      $('button.ticketProductAnnulerButton').click( function() {
        $('ticketProducAnnulerForm').submit();
      });

      

//empoyer/modifierUser       

      //Pour modifier la photo seulement
      $('button.modifierTofUserButton').click( function() {
        $('form.modifierTofUserForm').submit();
      });

      //Pour modifier les infomation du profil
      $('button.modifierProfilUserButton').click( function() {
        $('form.modifierProfilUserForm').submit();
      });

      //Pour modifier le mot de passe
       $('button.modifierMdpUserButton').click( function() {
        $('form.modifierMdpUserForm').submit();
      });


//Client/modifierClient

      //Pour modifier les infomation du profil
      $('button.modifierProfilClientButton').click( function() {
        $('form.modifierProfilClientForm').submit();
      });

      //Pour modifier la photo seulement
      $('button.modifierTofClientButton').click( function() {
        $('form.modifierTofClientForm').submit();
      });


//Product/modifierProduct

      //Pour modifier les infomation du profil
      $('button.modifierProfilsProductButton').click( function() {
        $('form.modifierProfilsProductForm').submit();
      });

      //Pour modifier la photo seulement
      $('button.modifierTofProductButton').click( function() {
        $('form.modifierTofProductForm').submit();
      });


    