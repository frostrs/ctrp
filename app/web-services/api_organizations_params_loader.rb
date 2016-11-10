class ApiOrganizationsParamsLoader
  $rest_params = {}
  $mapperObject

  def initialize
    $errors = {}
    $rest_params = {}
  end

  def load_params(xmlMapperObject,type)
    $rest_params = {}
    $mapperObject =xmlMapperObject.organization

    #$rest_params.push
    case type
      when "create"
        $rest_params[:edit_type] ="create"
      #$rest_params[:trial_ownerships_attributes] =[]
      #create_owner
      when "update"
        $rest_params[:edit_type] ="update"
    end


    #p "this is mapper object COUNTRY $$$$$$  "
    #p $mapperObject

    #p $mapperObject.address.country
    #Checking for Valid country
    check_state_and_country


    #checkCountry = $mapperObject.address.country
    ##In model to add some custom code use following identifier ; so that active model know from where this request is coming;
    $rest_params[:coming_from] = "rest"
    [:source_context_id,:source_id,:ctep_org_type_id,:source_status_id,:name].each do |attr|
      if !$mapperObject.send(attr).nil?
        p attr
        p $mapperObject.send(attr)
          $rest_params[attr] = $mapperObject.send(attr)
      end
    end

    [:address,:address2,:address3,:city,:state_province,:postal_code,:country].each do |attr|
      if !$mapperObject.address.send(attr).nil?
        p $mapperObject.address.send(attr)
        $rest_params[attr] = $mapperObject.address.send(attr)
      end
    end

    $mapperObject.contacts.contact.each do |_key,_val|
      p _key
      p _val
      case _key
        when "email"
          $rest_params[:email] = _val
        when "phone"
          $rest_params[:phone] = _val
      end
    end

    p "printing rest params "
    p $rest_params
  end

  def errors
    return $errors
  end
  def get_rest_params()
    return $rest_params
  end

  def check_state_and_country
    geo_location_service = GeoLocationService.new

    country = geo_location_service._get_country_name_from_alpha3($mapperObject.address.country)

    if country.present?
      states = geo_location_service.get_states(country)
      Rails.logger.debug "States for country #{country}"
    else
      errors.store($mapperObject.address.country," Given counry is not valid ")
    end

    #state = geo_location_service._get_state_name_from_alpha2($mapperObject.address.state_province)

    #if country == "United States" && state.present?
    #  Rails.logger.debug "States for United States is #{country}"
    #else
    #  errors.store($mapperObject.address.country," Given counry is not valid ")
    #end

  end

end