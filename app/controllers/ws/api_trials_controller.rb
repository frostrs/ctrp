class Ws::ApiTrialsController < Ws::BaseApiController
  #wrap_parameters format: [:json, :xml]

  before_filter :find_person, only: [:show, :update]
  before_filter :sam, only: [:change_status]

  before_filter only: [:create,:update] do
    string = request.body.read
    begin
    bad_doc = Nokogiri::XML(string) { |config| config.options = Nokogiri::XML::ParseOptions::STRICT }
    rescue Nokogiri::XML::SyntaxError => e
    puts "caught exception: #{e}"
    end

    if request.content_type == "application/xml"
        @object = Hash.from_xml(string)
        puts "before raw input"
        puts @object
        puts "after raw output"
      #doc = Nokogiri::XML(string)
      #@object=Hash.from_xml(doc.to_s)
      else
        render nothing: true, status: :bad_request
    end

    trialkeys = @object["CompleteTrialRegistration"]

    puts trialkeys
    puts trialkeys["leadOrgTrialID"]


    if trialkeys.has_key?("leadOrgTrialID")
      errors ={"leadOrgTrialID" => "please verify its not existed"}
      render xml: errors, status: :bad_request
    end


    if trialkeys.assoc("ind").length > 0 || trialkeys.assoc("ide").length > 0


    else

      puts "no ind present or no ide info"

    end

    if trialkeys.assoc("pi").length > 0

    else

      puts "no principal investigator"

    end

    if trialkeys.assoc("grant").length > 0
      #  <tns:fundingMechanism>P30</tns:fundingMechanism>
      #  <tns:nihInstitutionCode>CA</tns:nihInstitutionCode>
      #  <tns:serialNumber>36727</tns:serialNumber>
      #  <tns:nciDivisionProgramCode>OD</tns:nciDivisionProgramCode>
      #  <tns:fundingPercentage>100.0</tns:fundingPercentage>
      # {"funding_mechanism"=>"B08", "institute_code"=>"AE", "serial_number"=>"456", "nci"=>"CCT/CTB", "_destroy"=>false}],

      grants_len = trialkeys.assoc("grant").length

      for i in 0..grants_len
#        puts trialkeys["grant"][i]["fundingMechanism"]
      end

      trialkeys["leadOrgTrialID"]

    else

      puts "no grant information"

    end



=begin
mapping = {"lead_protocol_id"=>"lead_protocol_id",
           "pilot"=>"pilot", "grant_question"=>"Yes", "ind_ide_question"=>"Yes", "study_source_id"=>2,
           "official_title"=>"Offtitle", "phase_id"=>1, "research_category_id"=>2, "primary_purpose_id"=>3, "primary_purpose_other"=>"",
           "secondary_purpose_id"=>1, "secondary_purpose_other"=>"", "accrual_disease_term_id"=>1, "start_date"=>"2015-12-03T05:00:00.000Z",
           "primary_comp_date"=>"2015-12-10T05:00:00.000Z", "comp_date"=>"2015-12-26T05:00:00.000Z", "comp_date_qual"=>"Actual",
           "primary_comp_date_qual"=>"Anticipated", "start_date_qual"=>"Anticipated", "responsible_party_id"=>1, "investigator_title"=>"",
           "intervention_indicator"=>"Yes", "sec801_indicator"=>"Yes", "lead_org_id"=>8352734, "pi_id"=>28186245, "sponsor_id"=>595150, "investigator_id"=>nil, "investigator_aff_id"=>nil
}
=end
    #mappings = {"firstName" => "fname", "lastName" => "lname","middleName" => "mname", "prefix" => "prefix", "suffix" => "suffix", "email" => "email", "fax" => "fax", "phone" => "phone"}
    #personkeys.keys.each { |k| personkeys[ mappings[k] ] = personkeys.delete(k) if mappings[k] }



  end


  #before_filter only: :update do
  # unless @json.has_key?('person')
  #  render nothing: true, status: :bad_request
  #end
  # end

  #before_filter only: :create do
  # @person = Person.find_by_name(@json['project']['name'])
  #end

  def index
    #render json: Project.where('owner_id = ?', @user.id)
  end

  def show
    if request.content_type == "application/json"
      render json: @trial
    elsif request.content_type == "application/xml"
      render xml: @trial
    else
      render json: @trial
    end
  end

  def create



    puts @object["trial"]

    @object= {
     "trial"=>{"lead_protocol_id"=>"nci", "pilot"=>"No", "grant_question"=>"Yes", "ind_ide_question"=>"Yes", "study_source_id"=>2,
               "official_title"=>"Offtitle", "phase_id"=>1, "research_category_id"=>2, "primary_purpose_id"=>3, "primary_purpose_other"=>"",
               "secondary_purpose_id"=>1, "secondary_purpose_other"=>"", "accrual_disease_term_id"=>1, "start_date"=>"2015-12-03T05:00:00.000Z",
               "primary_comp_date"=>"2015-12-10T05:00:00.000Z", "comp_date"=>"2015-12-26T05:00:00.000Z", "comp_date_qual"=>"Actual",
               "primary_comp_date_qual"=>"Anticipated", "start_date_qual"=>"Anticipated", "responsible_party_id"=>1, "investigator_title"=>"",
               "intervention_indicator"=>"Yes", "sec801_indicator"=>"Yes", "lead_org_id"=>8352734, "pi_id"=>28186245, "sponsor_id"=>595150, "investigator_id"=>nil, "investigator_aff_id"=>nil
     }
    }
    @trial= Trial.new(@object["trial"])
    #@person.assign_attributes(@json['person'])
    if @trial.save
      if request.content_type == "application/json"
        puts "**********"
        print response
        puts "***********"
        render json: @trial
      elsif request.content_type == "application/xml"
        render xml: @trial
      else

      end
    else
      render nothing: true, status: :bad_request
    end

    #end
  end


  def update

    @person =Person.find_by_id(params[:id])
    if @person.update(@object["person"])
      if request.content_type == "application/json"
        render json: @person
      elsif request.content_type == "application/xml"
        render xml: @person
      else

      end
    else
      render nothing: true, status: :bad_request
    end
  end

  def change_status
    puts @status
    status_id = SourceStatus.find_by_name(@status.upcase).id
    if @person.update({"source_status_id" => status_id})
      if request.content_type == "application/json"
        render json: @person
      elsif request.content_type == "application/xml"
        render xml: @person
      else
        render json: @person
      end
    else
      render nothing: true, status: :bad_request
    end
  end

  private
  def find_person
    @person = Person.find_by_id(params[:id])
    render nothing: true, status: :not_found unless @person.present?
  end

  def sam
    @status = request.body.read
    @person = Person.find_by_id(params[:id])
    #render nothing: true, status: :not_found unless @person.present? && request.body.read.length > 0  &&  request.content_type == "text/plain"
  end



  def person_params
    params.require(:person).permit(:source_id, :fname, :mname, :lname, :suffix,:prefix, :email, :phone,
                                   :source_status_id,:source_context_id, :lock_version,
                                   po_affiliations_attributes: [:id, :organization_id, :effective_date,
                                                                :expiration_date, :po_affiliation_status_id,
                                                                :lock_version, :_destroy])
  end
end