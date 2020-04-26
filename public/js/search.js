(function($){


   $('#CodeBr').focus();


    //Chercher les produit dans POS
    $('#scannFilterClientPos').keyup(function(event){  //on prend le focus sur se champs directement à l'affichage de la page
        var input = $(this);
        var val = input.val();

        if(val == ''){   //si la valeur du champs est vide il va faloire nettoyer un peut se qu'on a fait
           $('.filter div').show();
           $('.filter #span2').removeClass('highlighted');
           return true; //pour empecher la fct d'aller plus loin
        }

        var regexp = '\\b(.*)';
            for(var i in val){
                 regexp += '('+val[i]+')(.*)';
            }
            regexp += '\\b';

        $('.filter div').show();
        $('.filter').find('h1>#span2').each(function(){
            var span = $(this);
            var resultats = span.text().match(new RegExp(regexp,'i'));
            if(resultats){
                var string = '';
                for(var i in resultats){
                    if(i > 0){
                        if( i%2 == 0){
                            string += resultats[i];
                        }else{
                            string += resultats[i];
                        }
                     
                    }
                }
                
                span.empty().append(string);
                
                
            }else{
                span.parent().parent().hide();
               
            
            }
        
        })
        
    });















    //Chercher les client dans listClient
    $('#scannFilterClient').focus().keyup(function(event){  //on prend le focus sur se champs directement à l'affichage de la page
        var input = $(this);
        var val = input.val();

        if(val == ''){   //si la valeur du champs est vide il va faloire nettoyer un peut se qu'on a fait
           $('.filter div').show();
           $('.filter #span2').removeClass('highlighted');
           return true; //pour empecher la fct d'aller plus loin
        }

        var regexp = '\\b(.*)';
            for(var i in val){
                 regexp += '('+val[i]+')(.*)';
            }
            regexp += '\\b';

        $('.filter div').show();
        $('.filter').find('.dp>#span2').each(function(){
            var span = $(this);
            var resultats = span.text().match(new RegExp(regexp,'i'));
            if(resultats){
                var string = '';
                for(var i in resultats){
                    if(i > 0){
                        if( i%2 == 0){
                            string += resultats[i];
                        }else{
                            string += resultats[i];
                        }
                     
                    }
                }
                
                span.empty().append(string);
                
                
            }else{
                span.parent().parent().parent().parent().hide();
               
            
            }
        
        })
        
    });
         














    //Chercher les produits dans listProduit
    
    $('#scannFilterProduct').focus().keyup(function(event){  //on prend le focus sur se champs directement à l'affichage de la page
        var input = $(this);
        var val = input.val();

        if(val == ''){   //si la valeur du champs est vide il va faloire nettoyer un peut se qu'on a fait
           $('.filter tr').show();
           $('.filter #span2').removeClass('highlighted');
           return true; //pour empecher la fct d'aller plus loin
        }

        var regexp = '\\b(.*)';
            for(var i in val){
                 regexp += '('+val[i]+')(.*)';
            }
            regexp += '\\b';

        $('.filter tr').show();
        $('.filter').find('td>#span2').each(function(){
            var span = $(this);
            var resultats = span.text().match(new RegExp(regexp,'i'));
            if(resultats){
                var string = '';
                for(var i in resultats){
                    if(i > 0){
                        if( i%2 == 0){
                            string += resultats[i];
                        }else{
                            string += resultats[i];
                        }
                     
                    }
                }
                
                span.empty().append(string);
                
                
            }else{
                span.parent().parent().hide();   
            }
        
        })
        
    });













    
    //Chercher les produits dans Stock
    
    $('#scannFilterProductStock').focus().keyup(function(event){  //on prend le focus sur se champs directement à l'affichage de la page
        var input = $(this);
        var val = input.val();

        if(val == ''){   //si la valeur du champs est vide il va faloire nettoyer un peut se qu'on a fait
           $('.filter div').show();
           $('.filter #span2').removeClass('highlighted');
           return true; //pour empecher la fct d'aller plus loin
        }

        var regexp = '\\b(.*)';
            for(var i in val){
                 regexp += '('+val[i]+')(.*)';
            }
            regexp += '\\b';

        $('.filter div').show();
        $('.filter').find('.dp>#span2').each(function(){
            var span = $(this);
            var resultats = span.text().match(new RegExp(regexp,'i'));
            if(resultats){
                var string = '';
                for(var i in resultats){
                    if(i > 0){
                        if( i%2 == 0){
                            string += resultats[i];
                        }else{
                            string += resultats[i];
                        }
                     
                    }
                }
                
                span.empty().append(string);
                
                
            }else{
                span.parent().parent().parent().parent().hide();   
            }
        
        })
        
    });

})(jQuery);